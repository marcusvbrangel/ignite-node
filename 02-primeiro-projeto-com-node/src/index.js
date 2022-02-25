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


app.listen(3333);
