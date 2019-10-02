"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _response = _interopRequireDefault(require("../response"));

var _Product = _interopRequireDefault(require("../models/Product"));

var _winston = _interopRequireDefault(require("../config/winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable linebreak-style */
class CartController {
  static async createProduct(req, res) {
    // Check if the product name already exists
    try {
      const {
        price,
        imageUrl
      } = req.body;
      const productName = req.body.productName.toLowerCase();
      const productExists = await _Product.default.find('name', productName);
      if (productExists) return (0, _response.default)(res, 400, 'A product with the same name already exists');
      const newProduct = await _Product.default.createProduct(productName, price, imageUrl);
      return (0, _response.default)(res, 201, newProduct);
    } catch (error) {
      return (0, _response.default)(res, 500, error);
    }
  }

  static async getAllProducts(req, res) {
    try {
      // Check if the user has a cart
      const products = await _Product.default.getAll();
      return (0, _response.default)(res, 200, products);
    } catch (error) {
      _winston.default.error(error);

      return (0, _response.default)(res, 500, error);
    }
  }

  static async updatePrice(req, res) {
    try {
      // Check if the product exists
      const {
        productId
      } = req.params;
      const {
        price
      } = req.body;
      const productExists = await _Product.default.find('id', productId);
      if (!productExists) return (0, _response.default)(res, 400, 'Product does not exist');
      const updatedProduct = await _Product.default.updatePrice(productId, price);
      return (0, _response.default)(res, 200, updatedProduct);
    } catch (error) {
      _winston.default.error(error);

      return (0, _response.default)(res, 500, error);
    }
  } //   static async deleteProduct(req, res) {
  //     try {
  //     } catch (error) {
  //       response(res, 500, error);
  //     }
  //   }
  //   static async updateProduct(req, res) {
  //     try {
  //     } catch (error) {
  //       response(res, 500, error);
  //     }
  //   }


}

var _default = CartController;
exports.default = _default;