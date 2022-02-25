const express = require("express"); 
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());


const customers = [];

// Middleware
const verifyIfAccoutExistsByCPF = (request, response, next) => {

  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: "Customer not found" });
  }

  request.customer = customer;

  return next();

}

const getBalance = (statement) => {

  const balance = statement.reduce((accumulator, operation) => {

    if (operation.type === "credit") {

      return accumulator + operation.amount;

    } else if (operation.type === "debit") {

      return accumulator - operation.amount;

    }

  }, 0); // -> initial value of accumulator...

  return balance;

}

app.post("/account", (request, response) => {

  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists!" });
  }

  const id = uuidv4();

  customers.push({
    cpf,
    name,
    id,
    statement: []
  });

  return response.status(201).send();

});

// app.use(verifyIfAccoutExistsByCPF);

app.get("/statement", verifyIfAccoutExistsByCPF, (request, response) => {

  const { customer } = request;

  return response.status(200).json(customer.statement);

});


app.post("/deposit", verifyIfAccoutExistsByCPF, (request, response) => {

  const { description, amount } = request.body;

  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    crated_at: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperation);

  return response.status(201).send();

});

app.post("/withdraw", verifyIfAccoutExistsByCPF, (request, response) => {

  const { amount } = request.body;

  const { customer } = request;

  const balance = getBalance(customer.statement);


  if (amount > balance) {

    return response.status(400).json({ error: "Insufficient funds!" });

  }

  const statementOperation = {
    amount,
    crated_at: new Date(),
    type: "debit"
  }

  customer.statement.push(statementOperation);

  return response.status(201).send();

});

app.listen(3333);
