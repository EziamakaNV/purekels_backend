/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
import database from '../config/Db/index';
import logger from '../config/winston';

const carts = process.env.NODE_ENV === 'production' ? 'carts' : 'testCarts';

let cartsCollection;
(async () => {
  try {
    const db = await database.catch((err) => { throw new Error(err); });
    cartsCollection = db.collection(carts);
  } catch (error) {
    logger.error(error);
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
        const result = await cartsCollection.findOne({ owner: userId });
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
        const increaseOrDecrease = (incrementOrDecrement === 'increment') ? 1 : -1;
        const cart = await CartModel.findCart(userId);
        const cartItem = cart.items.find(item => item.productId === productId);
        if (!cartItem && incrementOrDecrement === 'decrement') return resolve('Item does not exist in cart');
        // If the cartItem is not found insert the product into the items array
        // https://docs.mongodb.com/manual/reference/operator/update/push/
        if (!cartItem) {
          const updatedCart = await cartsCollection.findOneAndUpdate(
            { owner: userId },
            {
              $push:
              { items: { productId, quantity: 1 } },
            },
            { returnOriginal: false },
          );
          return resolve(updatedCart.value);
        }
        if (cartItem.quantity === 1 && increaseOrDecrease !== 1) { // Dont decrement when quantity equals 0
          const updatedCart = await CartModel.deleteProduct(userId, productId);
          resolve(updatedCart);
        }
        const result = await cartsCollection.findOneAndUpdate({ owner: userId, 'items.productId': productId },
          { $inc: { 'items.$.quantity': increaseOrDecrease } }, { returnOriginal: false });
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
          items: [
            {
              productId,
              quantity: 1,
            },
          ],
        });
        return resolve(result.ops[0]);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static deleteProduct(userId, productId) {
    return new Promise((resolve, reject) => {
      if (cartsCollection === false) {
        return reject(new Error('Db Connection failed'));
      }
      return CartModel.findCart(userId)
        .then((cart) => {
          const cartItem = cart.items.find(item => item.productId === productId);
          if (!cartItem) return reject(new Error('Item not in cart'));
          return cartsCollection.findOneAndUpdate({ owner: userId }, { $pull: { items: { productId } } },
            { returnOriginal: false })
            .then((doc) => {
              resolve(doc.value);
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  static updateByQuantity(userId, productId, quantity) {
    return new Promise((resolve, reject) => {
      if (cartsCollection === false) {
        return reject(new Error('Db Connection failed'));
      }
      return CartModel.findCart(userId)
        .then((cart) => {
          const cartItem = cart.items.find(item => item.productId === productId);
          if (!cartItem) return reject(new Error('Item not in cart'));
          return cartsCollection.findOneAndUpdate({ owner: userId, 'items.productId': productId },
            { $set: { 'items.$.quantity': quantity } }, { returnOriginal: false })
            .then((doc) => {
              resolve(doc.value);
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
}

export default CartModel;
