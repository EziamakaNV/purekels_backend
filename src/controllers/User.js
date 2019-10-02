/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';

import response from '../response';

import UserModel from '../models/User';

require('dotenv').config();

class UserController {
  static async signup(req, res) {
    try {
      const {
        firstName,
        lastName,
        password,
        address,
        phoneNumber,
      } = req.body;

      // Remove empty spaces from the email and set to lowercase
      const email = req.body.email.replace(/\s/g, '').toLowerCase(); // The .replace is from Stack Overflow. It removes empty spaces

      // Check if the email exists on record
      const userExists = await UserModel.findUser(email);
      if (userExists) {
        res.status(400).json({ status: 400, error: 'Email already exists', success: false });
      } else { // Store user data
        // Hash password
        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        const userObject = {
          firstName,
          lastName,
          email,
          phoneNumber,
          password: hashedPassword,
          address,
          isAdmin: false };
        const newUser = await UserModel.createUser(userObject);
        // Generate jwt
        const token = jwt.sign({ id: newUser._id, email, isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '8760h' });
        // Set cookie header
        res.cookie('jwt', token, { maxAge: 31540000000, httpOnly: true });
        res.cookie('user', JSON.stringify({ firstName, lastName }), { maxAge: 31540000000 });
        // Final response
        res.status(200).json({
          status: 200,
          data: { token, ...newUser },
          success: true,
        });
      }
    } catch (error) {
      response(res, 500, error);
    }
  }

  static async signin(req, res) {
    try {
      const { password } = req.body;
      // Remove empty spaces from the email and set to lowercase
      const email = req.body.email.replace(/\s/g, '').toLowerCase();

      const user = await UserModel.findUser(email);

      if (user) {
        // Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (match) { // (same-boolean) If the passwords match
          const token = jwt.sign({ id: user._id, email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '8760h' });
          res.cookie('jwt', token, { maxAge: 31540000000, httpOnly: true });
          // httpOnly not set because
          // I want to be able to read the cookie
          // on the client side with Js
          res.cookie('user', JSON.stringify({ firstName: user.firstName, lastName: user.lastName }), { maxAge: 31540000000 });
          res.status(200).json({
            status: 200,
            data: {
              token,
              id: user._id,
              first_name: user.firstName,
              last_name: user.lastName,
              email,
            },
          });
        } else {
          res.status(401).json({ status: 401, error: 'The Email/Paswword is incorrect' });
        }
      } else {
        res.status(401).json({ status: 401, error: 'The Email/Paswword is incorrect' });
      }
    } catch (error) {
      response(res, 500, error);
    }
  }
}

export default UserController;