/* eslint-disable linebreak-style */
import Joi from '@hapi/joi';

const firstName = Joi.string().min(3).max(15).required();
const lastName = Joi.string().min(3).max(15).required();
const email = Joi.string().email().required();
const password = Joi.string().min(6).max(20).required();
const address = Joi.string().min(15).max(50).required();
const phoneNumber = Joi.string().regex(/^[0]\d{10}$/).required();
const productId = Joi.string().required();

class Validation {
  static signUpValidation(validationObject) {
    const schema = {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
    };
    return Joi.validate(validationObject, schema);
  }

  static loginValidation(validationObject) {
    const schema = {
      email,
      password,
    };
    return Joi.validate(validationObject, schema);
  }

  static addToCart(validationObject) {
    const schema = {
      productId,
    };
    return Joi.validate(validationObject, schema);
  }
}

export default Validation;
