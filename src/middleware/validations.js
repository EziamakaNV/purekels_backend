/* eslint-disable linebreak-style */
import Joi from '@hapi/joi';
import response from '../response';

const firstName = Joi.string().min(3).max(15).required();
const lastName = Joi.string().min(3).max(15).required();
const email = Joi.string().email().required();
const password = Joi.string().min(6).max(20).required();
const address = Joi.string().min(15).max(50).required();
const phoneNumber = Joi.string().regex(/^[0]\d{10}$/).required();
const productId = Joi.number().integer().required();
const quantity = Joi.number().integer().min(1).required();

class Validation {
  static signUpValidation(req, res, next) {
    const schema = {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
    };
    const { error } = Joi.validate(req.body, schema);
    if (error) return response(res, 400, error);
    return next();
  }

  static loginValidation(req, res, next) {
    const schema = {
      email,
      password,
    };
    const { error } = Joi.validate(req.body, schema);
    if (error) return response(res, 400, error);
    return next();
  }

  static addOrDeductFromCart(req, res, next) {
    const schema = {
      productId,
    };
    const { error } = Joi.validate(req.params, schema);
    if (error) return response(res, 400, error);
    return next();
  }

  static updateProductByQuantity(req, res, next) {
    const schema = {
      productId,
      quantity,
    };
    const { error } = Joi.validate(req.params, schema);
    if (error) return response(res, 400, error);
    return next();
  }
}

export default Validation;
