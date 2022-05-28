// Based off of code from thodges-gh/CL-EA-NodeJS-Template (I love you Patrick Collins)
// Author: @JJZFIVE

const { Requester, Validator } = require("@chainlink/external-adapter");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const carModel = require("./models/carmodels");

dotenv.config();
const URI = process.env.DB_URI;

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("connected!"));

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  model: ["model"],
  wrap: ["wrap"],
  engine: ["engine"],
  endpoint: false,
};

const createRequest = async (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input, customParams);
  const jobRunID = validator.validated.id;

  const model = parseInt(validator.validated.data.model);
  const wrap = parseInt(validator.validated.data.wrap);
  const engine = parseInt(validator.validated.data.engine);

  const car = await carModel.findOne({
    model: model,
    wrap: wrap,
    engine: engine,
  });

  const response = {
    jobRunID: jobRunID,
    data: null,
    result: null,
    statusCode: 200,
  };

  try {
    response.data = {
      tokenURI: car.fullcarmetadata,
      result: car.fullcarmetadata,
    };
    const requesterSuccess = Requester.success(jobRunID, response);

    requesterSuccess.statusCode = 200;

    callback(200, requesterSuccess);
  } catch (error) {
    console.log("my error:", error);
    callback(500, Requester.errored(jobRunID, error));
  }
};

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data);
  });
};

// This allows the function to be exported for testing
// or for running in express
//module.exports.createRequest = createRequest;
