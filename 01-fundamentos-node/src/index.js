const express = require("express");

const app = express();

app.use(express.json());

// HTTP METHODS:
// GET POST PUT PATCH DELETE

/**
 * PARAMS TYPES:
 * Route Params ->  Identity a resource  ->  search / edit / delete     ->  resource/:id  ->  { id: '1544' }
 * Query Params ->  Pagination / Filter  ->  resource?page=1&order=asc  ->  { page: '1', order: 'asc' }
 * Body Params  ->  body of request      ->  insert / update            ->  { name: 'Marcus Rangel', email: 'marcus.vbrangel@gmail.com' }
 */

app.get("/courses", (req, res) => {

  // query params...

  const query = req.query;

  console.log("query", query);

  return res.json(["course 1", "course 2", "course 3"]);

});

app.post("/courses", (req, res) => {

  // body params...

  const body = req.body;

  console.log("body", body);

  return res.json(["course 1", "course 2", "course 3", "course 4"]);

});

app.put("/courses/:id", (req, res) => {

  // route params...

  // const params = req.params;
  console.log("params", params);

  // or...

  const { id } = req.params;

  console.log("id", id);

  return res.json(["course 6", "course 2", "course 3", "course 4"]);

});

app.patch("/courses/:id", (req, res) => {
  return res.json(["course 6", "course 7", "course 3", "course 4"]);
});

app.delete("/courses/:id", (req, res) => {
  return res.json(["course 6", "course 7", "course 4"]);
});


app.listen(3333);
