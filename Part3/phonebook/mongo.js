const mongoose = require("mongoose");

if (process.argv.lengt < 5) {
  console.log(
    "Please provide the password, name and number as arguments: node mongo.js",
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://danyalraxa007_db_user:${password}@cluster0.gfcqt7n.mongodb.net/?appName=Cluster`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note);
    });
    mongoose.connection.close();
  });
}
const person = new Person({
  name: name,
  number: number,
});

person.save().then((result) => {
  console.log(`added ${name} number ${number} to phonebook`);
  mongoose.connection.close();
});
