const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/server");
const should = chai.should();
chai.use(chaiHttp);

// Agent that will keep track of our cookies
const agent = chai.request.agent(server);

const User = require("../src/models/user");

describe("User", function () {
  // TESTS WILL GO HERE.
});