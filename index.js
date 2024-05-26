require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

app.use(cors());

app.use(express.static("dist"));

morgan.token("body", (req, res) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", async (request, response) => {
  const id = request.params.id;
  const person = await Person.findById(id);
  if (!person) {
    response.status(404).send("Not found");
    return;
  }
  await response.json(person);
});

app.delete("/api/persons/:id", async (request, response) => {
  const id = request.params.id;
  persons = await Person.findByIdAndDelete(id);
  response.status(204).send();
});

app.use(express.json());

app.post("/api/persons", async (request, response) => {
  const body = request.body;

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).send("name or number missing");
  }
  if (await Person.findOne({ name: body.name })) {
    return response.status(400).send("name must be unique");
  }

  console.log("person:", body);
  const id = "" + Math.floor(Math.random() * 100);

  const person = new Person({
    name: body.name,
    number: body.number,
    id: id,
  });

  const savedPerson = await person.save();
  response.json(savedPerson);
});

app.get("/info", async (request, response) => {
  const length = await Person.countDocuments({});
  response.send(`<p>Phonebook has ${length} people</p>
    <p>${new Date()}</p>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
