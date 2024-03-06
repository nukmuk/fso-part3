const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: "1",
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4",
  },
];

morgan.token("body", (req, res) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (!person) {
    response.status(404).send("Not found");
    return;
  }
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).send();
});

app.use(express.json());

app.post("/api/persons", (request, response) => {
  const person = request.body;

  if (person.name === undefined || person.number === undefined) {
    return response.status(400).send("name or number missing");
  }
  if (persons.some((listPerson) => listPerson.name === person.name)) {
    return response.status(400).send("name must be unique");
  }

  console.log("person:", person);
  person.id = "" + Math.floor(Math.random() * 100);
  persons = persons.concat(person);
  response.json(person);
});

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has ${persons.length} people</p>
    <p>${new Date()}</p>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
