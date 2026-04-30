const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.static('dist'))

var morgan = require("morgan");
app.use(cors());
app.use(express.json());
morgan.token("posttt", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :posttt",
  ),
);

// app.get("/", function (req, res) {
//   res.send("hello, world!");
// });

let data = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

// app.use(requestLogger);
app.get("/api/persons", (req, res) => {
  res.send(data);
});

app.get("/info", (req, res) => {
  res.send(
    `Phonebook has info for ${data.length} people <br><br>${new Date()}`,
  );
});

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  // console.log(id)

  const personData = data.find((person) => person.id === id);
  console.log(personData);
  if (!personData) {
    res.status(404).end();
  }
  res.send(personData);
});

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;

  data = data.filter((person) => person.id !== id);
  res.status(204).send();
});

app.post("/api/persons", (req, res) => {
  const person = req.body;

  if (!person.name || !person.number) {
    return res.status(400).send("Enter name and number for user");
  }
  const found = data.find((ele) => ele.name === person.name);
  if (found) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const personObject = {
    id: String(Math.ceil(Math.random() * 1000)),
    name: person.name,
    number: person.number,
  };
  console.log(personObject);
  data.push(personObject);
  console.log(data);
  return res.status(201).send(personObject);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
