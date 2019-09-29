"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("./Db/index"));

var _winston = _interopRequireDefault(require("../config/winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable linebreak-style */

/* eslint-disable no-console */

/* eslint-disable linebreak-style */
const carts = process.env.NODE_ENV === 'production' ? 'carts' : 'testCarts';
let cartsCollection;

(async () => {
  try {
    const db = await _index.default.catch(err => {
      throw new Error(err);
    });
    cartsCollection = db.collection(carts);
  } catch (error) {
    _winston.default.error(error);

    cartsCollection = false;
  }
})();

class CartModel {
  static findCart(userId) {
    return new Promise(async (resolve, reject) => {
      if (cartsCollection === false) {
        return reject(new Error('Db Connection failed'));
      }

      try {
        const result = await cartsCollection.findOne({
          owner: userId
        });
        return resolve(result);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static incrementOrDecrementProduct(userId, productId, incrementOrDecrement) {
    return new Promise(async (resolve, reject) => {
      if (cartsCollection === false) {
        return reject(new Error('Db Connection failed'));
      }

      try {
        // The $inc operator accepts positive and negative values.
        // If the field does not exist, $inc creates the field and sets the field to the specified value
        const increaseOrDecrease = incrementOrDecrement === 'increment' ? 1 : -1;
        const result = await cartsCollection.findOneAndUpdate({
          owner: userId,
          'items.productId': productId,
          'items.quantity': {
            $gt: 0
          }
        }, {
          $inc: {
            'items.$.quantity': increaseOrDecrease
          }
        }, {
          returnOriginal: false
        });
        return resolve(result.value);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static createCart(userId, productId) {
    return new Promise(async (resolve, reject) => {
      if (cartsCollection === false) {
        return reject(new Error('Db Connection failed'));
      }

      try {
        // The $inc operator accepts positive and negative values.
        // If the field does not exist, $inc creates the field and sets the field to the specified value
        const result = await cartsCollection.insertOne({
          owner: userId,
          items: [{
            productId,
            quantity: 1
          }]
        });
        return resolve(result.ops[0]);
      } catch (error) {
        return reject(error);
      }
    });
  }

}

var _default = CartModel;
exports.default = _default;