const mongoose = require("mongoose");

const MAX_COMPONENT_SUPPLY = 3333; // Change this when we publish smart contracts

const CarSchema = new mongoose.Schema({
  model: {
    type: Number,
    required: true,
    trim: true,
    validate(value) {
      if (value > MAX_COMPONENT_SUPPLY || value < 0)
        throw new Error("Invalid model value");
    },
  },
  wrap: {
    type: Number,
    required: true,
    trim: true,
    validate(value) {
      if (value > MAX_COMPONENT_SUPPLY || value < 0)
        throw new Error("Invalid wrap value");
    },
  },
  engine: {
    type: Number,
    required: true,
    trim: true,
    validate(value) {
      if (value > MAX_COMPONENT_SUPPLY || value < 0)
        throw new Error("Invalid engine value");
    },
  },
  fullcarimage: {
    type: String,
    default: "",
    // required: true, uncomment this for real thing
    trim: true,
  },
  fullcarvox: {
    type: String,
    default: "",
    // required: true, uncomment this for real thing
    trim: true,
  },
  fullcarmetadata: {
    type: String,
    default: "",
    // required: true, uncomment this for real thing
    trim: true,
  },
});

const Car = mongoose.model("cars", CarSchema);

module.exports = Car;
