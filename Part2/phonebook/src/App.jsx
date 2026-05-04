import { useState, useEffect } from "react";
import meow from "../services/persons";
import "./index.css";

/* ---------------- NOTIFICATION ---------------- */

const Notification = ({ message, error }) => {
  if (!message) return null;

  return (
    <div className={error ? "error" : "success"}>
      {message}
    </div>
  );
};

/* ---------------- FILTER ---------------- */

const Filter = ({ newFilter, handleFilter }) => (
  <div>
    filter shown with{" "}
    <input value={newFilter} onChange={handleFilter} />
  </div>
);

/* ---------------- FORM ---------------- */

const PersonForm = ({
  handleSubmit,
  newName,
  newNumber,
  handleName,
  handleNumber,
}) => (
  <form onSubmit={handleSubmit}>
    <div>
      name: <input value={newName} onChange={handleName} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumber} />
    </div>
    <button type="submit">add / update</button>
  </form>
);

/* ---------------- PERSON LIST ---------------- */

const Persons = ({ persons, filter, handleDelete }) => {
  const filtered = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {filtered.map(person => (
        <div key={person.id}>
          {person.name} {person.number}{" "}
          <button onClick={() => handleDelete(person.id, person.name)}>
            delete
          </button>
        </div>
      ))}
    </div>
  );
};

/* ---------------- APP ---------------- */

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    meow.getAll()
      .then(data => setPersons(data))
      .catch(() => {
        setMessage("Failed to load data");
        setError(true);

        setTimeout(() => {
          setMessage(null);
          setError(false);
        }, 3000);
      });
  }, []);

  /* ---------------- MESSAGE HELPER ---------------- */

  const showMessage = (msg, isError = false) => {
    setMessage(msg);
    setError(isError);

    setTimeout(() => {
      setMessage(null);
      setError(false);
    }, 3000);
  };

  /* ---------------- ADD / UPDATE ---------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    const existing = persons.find(p => p.name === newName);

    /* -------- UPDATE -------- */
    if (existing) {
      const confirmUpdate = window.confirm(
        `${newName} already exists. Replace the old number?`
      );

      if (!confirmUpdate) return;

      const updatedPerson = {
        name: newName,
        number: newNumber,
      };

      meow.editNumber(existing.id, updatedPerson)
        .then(returned => {
          setPersons(prev =>
            prev.map(p => p.id === existing.id ? returned : p)
          );

          setNewName("");
          setNewNumber("");
          showMessage(`Updated ${returned.name}`);
        })
        .catch(() => {
          setPersons(prev =>
            prev.filter(p => p.id !== existing.id)
          );

          showMessage(
            `${newName} was already removed from server`,
            true
          );
        });

      return;
    }

    /* -------- CREATE -------- */
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    meow.create(newPerson)
      .then(returned => {
        setPersons(prev => [...prev, returned]);
        setNewName("");
        setNewNumber("");
        showMessage(`Added ${returned.name}`);
      })
      .catch(error => {
        showMessage(
          error?.response?.data?.error || "Error adding person",
          true
        );
      });
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;

    meow.deletePerson(id)
      .then(() => {
        setPersons(prev => prev.filter(p => p.id !== id));
        showMessage(`Deleted ${name}`);
      })
      .catch(() => {
        showMessage(`Failed to delete ${name}`, true);
      });
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} error={error} />

      <Filter
        newFilter={newFilter}
        handleFilter={(e) => setNewFilter(e.target.value)}
      />

      <h3>add a new</h3>

      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        newNumber={newNumber}
        handleName={(e) => setNewName(e.target.value)}
        handleNumber={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>

      <Persons
        persons={persons}
        filter={newFilter}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;