const mongoose = require("mongoose");

const password = process.env.DB_PASSWORD;

// const url = `mongodb+srv://fullstack:${password}@fso-part3.zk0bsxv.mongodb.net/?retryWrites=true&w=majority&appName=fso-part3`;
const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: (
        props,
      ) => `${props.value} is not a valid phone number! Puhelinnumeron täytyy olla 
      vähintään 8 merkkiä pitkä ja koostua kahdesta väliviivalla erotetusta osasta 
      joissa ensimmäisessä osassa on 2 tai 3 numeroa ja toisessa osassa 
      riittävä määrä numeroita`,
    },
  },
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
