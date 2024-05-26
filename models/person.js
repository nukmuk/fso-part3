const mongoose = require("mongoose");

const password = process.env.DB_PASSWORD;

// const url = `mongodb+srv://fullstack:${password}@fso-part3.zk0bsxv.mongodb.net/?retryWrites=true&w=majority&appName=fso-part3`;
const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: String,
});

const Person = mongoose.model("Person", personSchema);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
