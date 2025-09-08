import { useState, useEffect } from "react";
import meow from "../services/persons";
import "./index.css";

const Filter = (props) => {
  console.log(props);
  return (
    <>
      filter shown with{" "}
      <input value={props.newFilter} onChange={props.handleFilter}></input>
    </>
  );
};

const Notification = ({ error, message }) => {
  if (error == true) {
    return <div className="error">{message}</div>;
  } else if (message === null) {
    return;
  }

  return <div className="success">{message}</div>;
};

const PersonForm = (props) => {
  console.log(props);
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        name: <input value={props.newName} onChange={props.handleInput} />
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.handleNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};
const Persons = (props) => {
  const filteredPersons = props.persons.filter((person) => {
    return props.newFilter.length === 0
      ? person
      : person.name.toLowerCase().includes(props.newFilter.toLowerCase());
  });

  return filteredPersons.map((person) => {
    return (
      <div key={person.id}>
        <p key={person.id}>
          {person.name} {person.number}
          <button
            onClick={() => {
              props.handleDeleteOf(person.id);
            }}
          >
            Delete
          </button>
        </p>
      </div>
    );
  });
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    meow.getAll().then((allPersons) => {
      console.log(allPersons);
      setPersons(allPersons);
    });
  }, []);

  const handleInput = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleDeleteOf = (id) => {
    const name = persons.find((person) => {
      return person.id === id;
    });

    if (window.confirm(`Are you sure you want to delete ${name.name}`)) {
      const timeoutFunction = setTimeout(() => {
        setMessage(null);
        setError(false);
      }, 3000);
      meow.deletePerson(id).then((person) => {
        // console.log(person);
        setMessage(`${person.name} has been successfully deleted`);
        setError(false);
        timeoutFunction();
      });
      setPersons(
        persons.filter((person) => {
          return person.id !== id;
        })
      );
    } else {
      console.log("AHAHHAH");
    }
  };

  const handleNumber = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilter = (event) => {
    console.log(event.target.value);
    setNewFilter(event.target.value);
  };

  const handleSubmit = (event) => {
    const timeoutFunction = setTimeout(() => {
      setMessage(null);
      setError(false);
    }, 3000);
    event.preventDefault();

    let personEdited = false;
    persons.find((person) => {
      if (person.name === newName && person.number === newNumber) {
        // alert(`${newName} already exists with the number ${newNumber}`);
        setMessage(`${newName} already exists with the number ${newNumber}`);
        setError(true);

        timeoutFunction();
        personEdited = true;
      } else if (person.name === newName && person.number !== newNumber) {
        personEdited = true;
        if (
          window.confirm(
            `${newName} is already added to the phone. Do you want to update the number?`
          )
        ) {
          const newPersonObject = { name: newName, number: newNumber };

          meow
            .editNumber(person.id, newPersonObject)
            .then((newPerson) => {
              const newPersonsArray = persons.map((person) => {
                return person.name === newPerson.name ? newPerson : person;
              });

              setMessage(`Successfully updated ${newName}'s number`);
              setError(false);

              timeoutFunction();

              setPersons(newPersonsArray);
              setNewName("");
              setNewNumber("");
            })
            .catch((error) => {
              setMessage(
                `Information of ${person.name} has already been removed from the server`
              );
              setError(true);

              setPersons(persons.filter((p) => p.name !== person.name));

              timeoutFunction();
            });
        }
      }
    });
    if (personEdited) {
      return;
    } else {
      const newPersonObject = { name: newName, number: newNumber };

      meow.create(newPersonObject).then((newPerson) => {
        setPersons(persons.concat(newPerson));
        setNewName("");
        setNewNumber("");

        setMessage(
          `Successfully added ${newPerson.name} with number ${newPerson.number}`
        );
        setError(false);

        timeoutFunction();
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification error={error} message={message} />
      <Filter newFilter={newFilter} handleFilter={handleFilter} />

      <h3>add a new</h3>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        newNumber={newNumber}
        handleInput={handleInput}
        handleNumber={handleNumber}
      />

      <h3>Numbers</h3>
      <Persons
        persons={persons}
        newFilter={newFilter}
        handleDeleteOf={handleDeleteOf}
      />
    </div>
  );
};

export default App;
