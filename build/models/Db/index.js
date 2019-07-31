"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.dbEmitter = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _mongodb = require("mongodb");

var _assert = _interopRequireDefault(require("assert"));

var _events = _interopRequireDefault(require("events"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable linebreak-style */
class MyEmitter extends _events.default {}

const dbEmitter = new MyEmitter();
exports.dbEmitter = dbEmitter;

_dotenv.default.config();

var _default = new Promise(async (resolve, reject) => {
  const client = await _mongodb.MongoClient.connect(process.env.DATABASE_URI, {
    poolSize: 5,
    useNewUrlParser: true
  }).catch(err => {
    dbEmitter.emit('error', new Error(err));
    reject(err);
  });

  if (client) {
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
      dbEmitter.emit('db_connected');
    }

    return resolve(client.db());
  }
});

exports.default = _default;