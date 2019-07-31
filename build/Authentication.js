"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _User = _interopRequireDefault(require("./models/User"));

var _response = _interopRequireDefault(require("./response"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-underscore-dangle */

/* eslint-disable linebreak-style */
require('dotenv').config();

class Authentication {
  static async verifyToken(req, res, next) {
    const token = req.cookies.jwt; // Check for the token

    if (!token) {
      res.status(401).json({
        status: 401,
        error: 'Missing token',
        success: false
      });
    } else {
      try {
        const user = await _jsonwebtoken.default.verify(token, process.env.JWT_SECRET); // // Create user object in the request
        // req.user = user;
        // next();
        // Check if the user is still in the DB

        const userExists = await _User.default.findUser(user.email);

        if (userExists) {
          // Create user object in the request
          req.user = {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin
          };
          next();
        } else {
          (0, _response.default)(res, 401, 'Malicious token request. You dont exist on the DB!');
        }
      } catch (error) {
        res.status(500).json({
          status: 500,
          error: "Issue with jwt token. Problem: ".concat(error)
        });
      }
    }
  } // static async adminVerifyToken(req, res, next) {
  //   const token = req.cookies.jwt;
  //   // Check for the token
  //   if (!token) {
  //     res.status(401).json({ status: 401, error: 'Missing token', success: false });
  //   } else {
  //     try {
  //       const user = await jwt.verify(token, process.env.JWT_SECRET);
  //       const userExists = await UserModel.findUser(user.email);
  //       if (userExists) {
  //         // Check if the user is an admin
  //         const isUserAdmin = await UserModel.isAdmin(user.id);
  //         if (isUserAdmin) {
  //           req.user = user;
  //           next();
  //         } else {
  //           response(res, 401, 'You are not an Admin');
  //         }
  //       } else {
  //         response(res, 401, 'Malicious token request. You dont exist on the DB!');
  //       }
  //     } catch (error) {
  //       res.status(500).json({ status: 500, error: `Issue with jwt token. Problem: ${error}` });
  //     }
  //   }
  // }


}

var _default = Authentication;
exports.default = _default;