"use strict";

var _mocha = _interopRequireDefault(require("mocha"));

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../server"));

var _index = _interopRequireDefault(require("../config/Db/index"));

var _winston = _interopRequireDefault(require("../config/winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable func-names */

/* eslint-disable prefer-arrow-callback */

/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable linebreak-style */
_chai.default.use(_chaiHttp.default);

const {
  expect
} = _chai.default;
let usersCollection;
before(function (done) {
  _index.default.then(function (db) {
    usersCollection = db.collection('testUsers');
    done();
  }).catch(function (err) {
    _winston.default.error("Mocha Db Connection ".concat(err));

    done();
  });
});
describe('POST /api/v1/auth/signup', function () {
  describe('When all values in the POST body are the right format', function () {
    it('Should return an object with properties "status" and "data" on success', function (done) {
      _chai.default.request(_server.default).post('/api/v1/auth/signup').type('form').send({
        firstName: 'Mekus',
        lastName: 'Success',
        password: '123456',
        address: '347838473 hbhfhdbfghb',
        phoneNumber: '09011111111',
        email: 'tp12@work.com'
      }).end(function (err, res) {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.has.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body.status).to.equal(200);
        expect(res.body).to.haveOwnProperty('data');
        expect(res.body.data).to.be.a('object');
        done();
      });
    });
    it('Should return an error if the email already exists', function (done) {
      _chai.default.request(_server.default).post('/api/v1/auth/signup').type('form').send({
        firstName: 'James',
        lastName: 'Potter',
        email: 'JamesP@hogwarts.com',
        password: 'expeliamus',
        address: 'lower bunk, room 23, Gryfindor House, Hogwarts',
        phoneNumber: '09097611892'
      }).end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.has.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body.status).to.equal(400);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.be.a('string');
        done();
      });
    });
    it('Should return an error if the length of any of the paremeters is less than 3', function (done) {
      // Mocha done callback for asynchronous tests
      _chai.default.request(_server.default).post('/api/v1/auth/signup').type('form').send({
        first_name: 'Jo',
        last_name: 'Doe',
        email: 'Me@test.com',
        password: 'secret',
        address: 'nowhere'
      }).end(function (err, res) {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(400); // eslint-disable-next-line no-unused-expressions

        expect(res.body).to.be.a('object');
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body.status).to.equal(400);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.be.a('string');
        done();
      });
    });
    describe('When the POST body parameters are not in the right format', function () {
      it('should not be able to post if all the parameters are not present', function (done) {
        _chai.default.request(_server.default).post('/api/v1/auth/signup').type('form').send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'for@loop.com'
        }).end(function (err, res) {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('error');
          expect(res.body.error).to.be.a('string');
          done();
        });
      });
    });
  });
  after(function (done) {
    usersCollection.findOneAndDelete({
      email: 'tp12@work.com'
    }).then(function () {
      done();
    }).catch(function (err) {
      _winston.default.error("Mocha Test ".concat(err));

      done();
    });
  });
});
describe('POST /api/v1/auth/signin', function () {
  describe('When all the data povided is in the right format', function () {
    it('if the user has an account, it should respond with a property status of 200 and a data property with a token', function (done) {
      _chai.default.request(_server.default).post('/api/v1/auth/signin').type('form').send({
        email: 'jamesp@hogwarts.com',
        password: 'expeliamus'
      }).end(function (err, res) {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res, 'response object status').to.have.status(200);
        expect(res.body, 'response body').to.be.a('object');
        expect(res.body, 'response body').to.haveOwnProperty('status');
        expect(res.body.status, 'status property').to.equal(200);
        expect(res.body, 'response body').to.haveOwnProperty('data');
        expect(res.body.data, 'data property').to.be.a('object');
        expect(res.body.data, 'data object').to.haveOwnProperty('token');
        done();
      });
    });
    it('should respond with 400 status and error properties if invalid credentials are submitted', function (done) {
      _chai.default.request(_server.default).post('/api/v1/auth/signin').type('form').send({
        email: 'to2p@work.com',
        password: 'nothing'
      }).end(function (err, res) {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res, 'response object status').to.have.status(401);
        expect(res.body, 'response body').to.be.a('object');
        expect(res.body, 'response body').to.haveOwnProperty('status');
        expect(res.body.status, 'status property').to.equal(401);
        expect(res.body, 'response body').to.haveOwnProperty('error');
        expect(res.body.error, 'error property').to.be.a('string');
        done();
      });
    });
  });
  describe('handles invalid input ((POST body properties))', function () {
    it('should not be able to log in if all parameters are not present', function (done) {
      _chai.default.request(_server.default).post('/api/v1/auth/signin').type('form').send({
        email: 'TDD@epicmail.com'
      }).end(function (err, res) {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body.status).to.equal(400);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.be.a('string');
        done();
      });
    });
  });
});