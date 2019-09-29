"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable linebreak-style */
const firstName = _joi.default.string().min(3).max(15).required();

const lastName = _joi.default.string().min(3).max(15).required();

const email = _joi.default.string().email().required();

const password = _joi.default.string().min(6).max(20).required();

const address = _joi.default.string().min(15).max(50).required();

const phoneNumber = _joi.default.string().regex(/^[0]\d{10}$/).required();

const productId = _joi.default.number().integer().required();

class Validation {
  static signUpValidation(validationObject) {
    const schema = {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber
    };
    return _joi.default.validate(validationObject, schema);
  }

  static loginValidation(validationObject) {
    const schema = {
      email,
      password
    };
    return _joi.default.validate(validationObject, schema);
  }

  static addToCart(validationObject) {
    const schema = {
      productId
    };
    return _joi.default.validate(validationObject, schema);
  }

}

var _default = Validation;
exports.default = _default;