require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

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

app.get("/api/persons/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const person = await Person.findById(id);
    if (!person) {
      response.status(404).end();
      return;
    }
    await response.json(person);
  } catch (e) {
    next(e);
  }
});

app.delete("/api/persons/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    persons = await Person.findByIdAndDelete(id);
    response.status(204).send();
  } catch (e) {
    next(e);
  }
});

app.post("/api/persons", async (request, response, next) => {
  try {
    const body = request.body;

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
  } catch (e) {
    next(e);
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  try {
    const body = req.body;
    const id = req.params.id;

    console.log("updated person:", body);

    const updatedPerson = await Person.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
      context: "query",
    });
    res.json(updatedPerson);
  } catch (e) {
    next(e);
  }
});

app.get("/info", async (request, response) => {
  const length = await Person.countDocuments({});
  response.send(`<p>Phonebook has ${length} people</p>
    <p>${new Date()}</p>`);
});

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

const unknownEndpoint = (req, res) => {
  res.status(400).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
