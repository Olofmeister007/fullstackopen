const express = require("express");
const cors = require("cors");
require('dotenv').config()
const Person = require("./models/mongoose");

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
const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if(error.name === "CastError")
  {
    return res.status(400).send({ error: "malformatted id"})
  }
  next(error);
}

// app.get("/", function (req, res) {
//   res.send("hello, world!");
// });

// let data = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

// app.use(requestLogger);
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error)); 
});

app.get("/info", (req, res) => {
  Person.find({}).then((persons)=> {
    return res.send(`Phonebook has info for ${persons.length} people <br><br>${new Date()}`,)
  })
  
});

// app.get("/api/persons/:id", (req, res) => {
//   const { id } = req.params;
//   // console.log(id)

//   // const personData = data.find((person) => person.id === id);
//   // console.log(personData);
//   // if (!personData) {
//   //   res.status(404).end();
//   // }
//   // res.send(personData);
//   Person.findById(id)
//   .then((person) => {
//     if(!person)
//     {
//       return res.status(404).send({error : "This id does not exist"})
//     }
//     res.json(person);
//   })
// });

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).json({ error: "not found" });
      }
      res.json(person);
    })
    .catch(error => next(error)); 
});

// app.delete("/api/persons/:id", (req, res) => {
//   const { id } = req.params;

//   // data = data.filter((person) => person.id !== id);
//   // res.status(204).send();
//   Person.findByIdAndDelete(id).then(() => {
//     res.status(204).end()
//   })
// });

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error)); 
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "name or number missing" });
  }

  const person = new Person({ name, number });

  person.save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true }
  )
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
