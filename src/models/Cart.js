/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
import database from './Db/index';
import logger from '../config/winston';
import response from '../response';

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
        const cart = await this.findCart(userId);
        const cartItem = cart.items.find(item => item.productId === productId);
        if (cartItem.quantity === 0 && increaseOrDecrease !== 1) { // Dont decrement when quantity equals 0
          return resolve(cart);
        }
        const result = await cartsCollection.findOneAndUpdate({ owner: userId, 'items.productId': productId, 'items.quantity': { $gte: 0 } },
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
}

export default CartModel;
