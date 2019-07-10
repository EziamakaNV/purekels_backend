"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _mongodb = require("mongodb");

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable linebreak-style */
_dotenv.default.config(); // export default new Promise(async (resolve, reject) => {
//   const client = await MongoClient.connect(process.env.DATABASE_URI, { poolSize: 5, useNewUrlParser: true })
//     .catch(err => reject(err));
//   return resolve(client.db());
// });


let db;
var _default = {
  connectToServer: callback => {
    _mongodb.MongoClient.connect(process.env.DATABASE_URI, {
      poolSize: 5,
      useNewUrlParser: true
    }, (err, client) => {
      console.log(client);
      db = client.db();
      return callback(err);
    });
  },
  getDb: () => db
};
exports.default = _default;