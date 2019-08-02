"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Validation = _interopRequireDefault(require("../validations/Validation"));

var _response = _interopRequireDefault(require("../response"));

var _Cart = _interopRequireDefault(require("../models/Cart"));

var _winston = _interopRequireDefault(require("../config/winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable linebreak-style */
class CartController {
  static async addToCart(req, res) {
    // Check if the user has a cart
    // if true, check if the roduct is already in the cart
    // if the product is in the cart increment the quantity by 1,
    // if the product is not in the cart, add the item and increment by one;
    try {
      const {
        productId
      } = req.params;

      const {
        error
      } = _Validation.default.addToCart({
        productId
      });

      if (error) {
        (0, _response.default)(res, 401, error);
      } else {
        // Check for Cart;
        const cart = await _Cart.default.findCart(req.user.id);

        if (cart) {
          // Increment the product
          // If the product is not there it creates the files and sets it to 1
          const updatedCart = await _Cart.default.incrementProduct(req.user.id, productId);
          (0, _response.default)(res, 200, updatedCart);
        } else {
          // Insert or create new cart and add the product setting the value to one
          const newCart = await _Cart.default.createCart(req.user.id, productId);
          (0, _response.default)(res, 200, newCart);
        }
      }
    } catch (error) {
      (0, _response.default)(res, 500, error);
    }
  }

  static async getCart(req, res) {
    try {
      // Check if the user has a cart
      const cart = await _Cart.default.findCart(req.user.id);

      if (cart) {
        (0, _response.default)(res, 200, cart);
      } else {
        (0, _response.default)(res, 401, 'Nothing in cart');
      }
    } catch (error) {
      _winston.default.error(error);

      (0, _response.default)(res, 500, error);
    }
  }

}

var _default = CartController;
exports.default = _default;