"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _index = _interopRequireDefault(require("./Db/index"));

var _winston = _interopRequireDefault(require("../config/winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const users = process.env.NODE_ENV === 'production' ? 'users' : 'testUsers';
let usersCollection;

(async () => {
  try {
    const db = await _index.default.catch(err => {
      throw new Error(err);
    });
    usersCollection = db.collection(users);
  } catch (error) {
    _winston.default.error(error);

    usersCollection = false;
  }
})();

class UserModel {
  static findUser(email) {
    return new Promise(async (resolve, reject) => {
      if (usersCollection === false) {
        return reject(new Error('Db Connection failed'));
      }

      usersCollection.findOne({
        email
      }).then(result => resolve(result)).catch(err => reject(err));
    });
  }

  static createUser(user) {
    return new Promise(async (resolve, reject) => {
      if (usersCollection === false) {
        return reject(new Error('Db Connection failed'));
      }

      usersCollection.insertOne(_objectSpread({}, user)).then(result => resolve(result.ops[0])).catch(err => reject(err));
    });
  }

  static isAdmin(userId) {}

}

var _default = UserModel;
exports.default = _default;