/* eslint-disable linebreak-style */
import response from '../response';
import CartModel from '../models/Cart';
import logger from '../config/winston';

class CartController {
  static async addOrDeductFromCart(req, res) {
    // Check if the product exists
    // Check if the user has a cart
    // if true, check if the roduct is already in the cart
    // if the product is in the cart increment the quantity by 1,
    // if the product is not in the cart, add the item and increment by one;
    try {
      const productId = Number(req.params.productId);
      // Check for Cart;
      const cart = await CartModel.findCart(req.user.id);
      if (cart) {
        // Increment the product
        // If the product is not there it creates the files and sets it to 1
        console.log(req.path);
        const addOrReduce = /decrement/i.test(req.path) ? 'decrement' : 'increment';
        const updatedCart = await CartModel.incrementOrDecrementProduct(req.user.id, productId, addOrReduce);
        response(res, 200, updatedCart);
      } else {
        // Insert or create new cart and add the product setting the value to one
        const newCart = await CartModel.createCart(req.user.id, productId);
        response(res, 200, newCart);
      }
    } catch (error) {
      response(res, 500, error);
    }
  }

  static async getCart(req, res) {
    try {
      // Check if the user has a cart
      const cart = await CartModel.findCart(req.user.id);
      if (cart) {
        response(res, 200, cart);
      } else {
        response(res, 200, { message: 'Nothing in cart' });
      }
    } catch (error) {
      logger.error(error);
      response(res, 500, error);
    }
  }

  static async deleteFromCart(req, res) {
    try {
      const productId = Number(req.params.productId);
      // Check for Cart;
      const cart = await CartModel.findCart(req.user.id);
      if (cart) {
        const updatedCart = await CartModel.deleteProduct(req.user.id, productId);
        response(res, 200, updatedCart);
      } else {
        response(res, 400, 'A cart does not exist for the user');
      }
    } catch (error) {
      response(res, 500, error);
    }
  }

  static async updateByQuantity(req, res) {
    try {
      const productId = Number(req.params.productId);
      const quantity = Number(req.params.quantity);
      // Check for Cart;
      const cart = await CartModel.findCart(req.user.id);
      if (cart) {
        const updatedCart = await CartModel.updateByQuantity(req.user.id, productId, quantity);
        response(res, 200, updatedCart);
      } else {
        response(res, 400, 'A cart does not exist for the user');
      }
    } catch (error) {
      response(res, 500, error);
    }
  }
}

export default CartController;
