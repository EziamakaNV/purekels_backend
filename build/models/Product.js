"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongodb = require("mongodb");

var _index = _interopRequireDefault(require("../config/Db/index"));

var _winston = _interopRequireDefault(require("../config/winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable linebreak-style */

/* eslint-disable no-console */

/* eslint-disable linebreak-style */
const products = process.env.NODE_ENV === 'production' ? 'products' : 'testProducts';
let productsCollection;

(async () => {
  try {
    const db = await _index.default.catch(err => {
      throw new Error(err);
    });
    productsCollection = db.collection(products);
  } catch (error) {
    _winston.default.error(error);

    productsCollection = false;
  }
})();

class ProductModel {
  static find(nameOrId, payLoad) {
    return new Promise((resolve, reject) => {
      if (productsCollection === false) {
        return reject(new Error('Db Connection failed'));
      }

      const findBy = nameOrId === 'name' ? 'name' : '_id';
      const where = findBy === 'id' ? new _mongodb.ObjectID(payLoad) : payLoad;
      productsCollection.findOne({
        [findBy]: where
      }).then(product => resolve(product)).catch(err => reject(err));
    });
  }

  static createProduct(name, price, imageUrl) {
    return new Promise((resolve, reject) => {
      if (productsCollection === false) {
        return reject(new Error('Db Connection failed'));
      }

      return productsCollection.insertOne({
        name,
        price,
        imageUrl: imageUrl || ''
      }).then(result => resolve(result.ops[0])).catch(err => reject(err));
    });
  } //   static incrementOrDecrementProduct(userId, productId, incrementOrDecrement) {
  //     return new Promise(async (resolve, reject) => {
  //       if (cartsCollection === false) {
  //         return reject(new Error('Db Connection failed'));
  //       }
  //       try {
  //         // The $inc operator accepts positive and negative values.
  //         // If the field does not exist, $inc creates the field and sets the field to the specified value
  //         const increaseOrDecrease = (incrementOrDecrement === 'increment') ? 1 : -1;
  //         const cart = await CartModel.findCart(userId);
  //         const cartItem = cart.items.find(item => item.productId === productId);
  //         if (!cartItem && incrementOrDecrement === 'decrement') return resolve('Item does not exist in cart');
  //         // If the cartItem is not found insert the product into the items array
  //         // https://docs.mongodb.com/manual/reference/operator/update/push/
  //         if (!cartItem) {
  //           const updatedCart = await cartsCollection.findOneAndUpdate(
  //             { owner: userId },
  //             {
  //               $push:
  //               { items: { productId, quantity: 1 } },
  //             },
  //             { returnOriginal: false },
  //           );
  //           return resolve(updatedCart.value);
  //         }
  //         if (cartItem.quantity === 1 && increaseOrDecrease !== 1) { // Dont decrement when quantity equals 0
  //           const updatedCart = await CartModel.deleteProduct(userId, productId);
  //           resolve(updatedCart);
  //         }
  //         const result = await cartsCollection.findOneAndUpdate({ owner: userId, 'items.productId': productId },
  //           { $inc: { 'items.$.quantity': increaseOrDecrease } }, { returnOriginal: false });
  //         return resolve(result.value);
  //       } catch (error) {
  //         return reject(error);
  //       }
  //     });
  //   }
  //   static createCart(userId, productId) {
  //     return new Promise(async (resolve, reject) => {
  //       if (cartsCollection === false) {
  //         return reject(new Error('Db Connection failed'));
  //       }
  //       try {
  //         // The $inc operator accepts positive and negative values.
  //         // If the field does not exist, $inc creates the field and sets the field to the specified value
  //         const result = await cartsCollection.insertOne({
  //           owner: userId,
  //           items: [
  //             {
  //               productId,
  //               quantity: 1,
  //             },
  //           ],
  //         });
  //         return resolve(result.ops[0]);
  //       } catch (error) {
  //         return reject(error);
  //       }
  //     });
  //   }
  //   static deleteProduct(userId, productId) {
  //     return new Promise((resolve, reject) => {
  //       if (cartsCollection === false) {
  //         return reject(new Error('Db Connection failed'));
  //       }
  //       return CartModel.findCart(userId)
  //         .then((cart) => {
  //           const cartItem = cart.items.find(item => item.productId === productId);
  //           if (!cartItem) return reject(new Error('Item not in cart'));
  //           return cartsCollection.findOneAndUpdate({ owner: userId }, { $pull: { items: { productId } } },
  //             { returnOriginal: false })
  //             .then((doc) => {
  //               resolve(doc.value);
  //             })
  //             .catch(err => reject(err));
  //         })
  //         .catch(err => reject(err));
  //     });
  //   }
  //   static updateByQuantity(userId, productId, quantity) {
  //     return new Promise((resolve, reject) => {
  //       if (cartsCollection === false) {
  //         return reject(new Error('Db Connection failed'));
  //       }
  //       return CartModel.findCart(userId)
  //         .then((cart) => {
  //           const cartItem = cart.items.find(item => item.productId === productId);
  //           if (!cartItem) return reject(new Error('Item not in cart'));
  //           return cartsCollection.findOneAndUpdate({ owner: userId, 'items.productId': productId },
  //             { $set: { 'items.$.quantity': quantity } }, { returnOriginal: false })
  //             .then((doc) => {
  //               resolve(doc.value);
  //             })
  //             .catch(err => reject(err));
  //         })
  //         .catch(err => reject(err));
  //     });
  //   }


}

var _default = ProductModel;
exports.default = _default;