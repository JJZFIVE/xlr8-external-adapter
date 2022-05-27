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

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === "Error") return true;
  return false;
};

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
  const endpoint = validator.validated.data.endpoint || "price";

  const model = parseInt(validator.validated.data.model);
  const wrap = parseInt(validator.validated.data.wrap);
  const engine = parseInt(validator.validated.data.engine);

  const car = await carModel.find({
    model: model,
    wrap: wrap,
    engine: engine,
  });

  console.log("car", car);

  let returnURI;
  try {
    returnURI = { tokenURI: car[0].fullcarmetadata };
    console.log("returned URI:", returnURI);
    callback(200, Requester.success(jobRunID, response));
  } catch (error) {
    returnURI = { tokenURI: "Invalid parameters" };
    console.log(error);
  }

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.request(config, customError)
    .then((response) => {
      // It's common practice to store the desired value at the top-level
      // result key. This allows different adapters to be compatible with
      // one another.
      response.data.result = Requester.getResult(response.data, ["tokenURI"]);
      callback(response.status, Requester.success(jobRunID, response));
    })
    .catch((error) => {
      callback(500, Requester.errored(jobRunID, error));
    });
};
/*
// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data);
  });
};
*/

/*
// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data);
  });
};
*/

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handler = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false,
    });
  });
};

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest;
