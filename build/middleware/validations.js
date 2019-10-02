"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _response = _interopRequireDefault(require("../response"));

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
  static signUpValidation(req, res, next) {
    const schema = {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber
    };

    const {
      error
    } = _joi.default.validate(req.body, schema);

    if (error) return (0, _response.default)(res, 400, error);
    return next();
  }

  static loginValidation(req, res, next) {
    const schema = {
      email,
      password
    };

    const {
      error
    } = _joi.default.validate(req.body, schema);

    if (error) return (0, _response.default)(res, 400, error);
    return next();
  }

  static addToCart(req, res, next) {
    const schema = {
      productId
    };

    const {
      error
    } = _joi.default.validate(req.params, schema);

    if (error) return (0, _response.default)(res, 400, error);
    return next();
  }

}

var _default = Validation;
exports.default = _default;