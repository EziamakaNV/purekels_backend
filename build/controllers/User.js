"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.replace");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _response = _interopRequireDefault(require("../response"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require('dotenv').config();

class UserController {
  static async signup(req, res) {
    try {
      const {
        firstName,
        lastName,
        password,
        address,
        phoneNumber
      } = req.body; // Remove empty spaces from the email and set to lowercase

      const email = req.body.email.replace(/\s/g, '').toLowerCase(); // The .replace is from Stack Overflow. It removes empty spaces
      // Check if the email exists on record

      const userExists = await _User.default.findUser(email);

      if (userExists) {
        res.status(400).json({
          status: 400,
          error: 'Email already exists',
          success: false
        });
      } else {
        // Store user data
        // Hash password
        const hashedPassword = await _bcrypt.default.hash(password, Number(process.env.SALT_ROUNDS));
        const userObject = {
          firstName,
          lastName,
          email,
          phoneNumber,
          password: hashedPassword,
          address,
          isAdmin: false
        };
        const newUser = await _User.default.createUser(userObject); // Generate jwt

        const token = _jsonwebtoken.default.sign({
          id: newUser._id,
          email,
          isAdmin: false
        }, process.env.JWT_SECRET, {
          expiresIn: '8760h'
        }); // Set cookie header


        res.cookie('jwt', token, {
          maxAge: 31540000000,
          httpOnly: true
        });
        res.cookie('user', JSON.stringify({
          firstName,
          lastName
        }), {
          maxAge: 31540000000
        }); // Final response

        res.status(200).json({
          status: 200,
          data: _objectSpread({
            token
          }, newUser),
          success: true
        });
      }
    } catch (error) {
      (0, _response.default)(res, 500, error);
    }
  }

  static async signin(req, res) {
    try {
      const {
        password
      } = req.body; // Remove empty spaces from the email and set to lowercase

      const email = req.body.email.replace(/\s/g, '').toLowerCase();
      const user = await _User.default.findUser(email);

      if (user) {
        // Compare passwords
        const match = await _bcrypt.default.compare(password, user.password);

        if (match) {
          // (same-boolean) If the passwords match
          const token = _jsonwebtoken.default.sign({
            id: user._id,
            email,
            isAdmin: user.isAdmin
          }, process.env.JWT_SECRET, {
            expiresIn: '8760h'
          });

          res.cookie('jwt', token, {
            maxAge: 31540000000,
            httpOnly: true
          }); // httpOnly not set because
          // I want to be able to read the cookie
          // on the client side with Js

          res.cookie('user', JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName
          }), {
            maxAge: 31540000000
          });
          res.status(200).json({
            status: 200,
            data: {
              token,
              id: user._id,
              first_name: user.firstName,
              last_name: user.lastName,
              email
            }
          });
        } else {
          res.status(401).json({
            status: 401,
            error: 'The Email/Paswword is incorrect'
          });
        }
      } else {
        res.status(401).json({
          status: 401,
          error: 'The Email/Paswword is incorrect'
        });
      }
    } catch (error) {
      (0, _response.default)(res, 500, error);
    }
  }

}

var _default = UserController;
exports.default = _default;