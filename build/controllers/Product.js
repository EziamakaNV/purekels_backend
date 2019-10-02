"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.replace");

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
      const productName = req.body.productName.replace(/\s/g, '').toLowerCase();
      const productExists = await _Product.default.find('name', productName);
      if (productExists) return (0, _response.default)(res, 400, 'A product with the same name already exists');
      const newProduct = await _Product.default.createProduct(productName, price, imageUrl);
      return (0, _response.default)(res, 201, newProduct);
    } catch (error) {
      return (0, _response.default)(res, 500, error);
    }
  }

  static async getProduct(req, res) {
    try {// Check if the user has a cart
    } catch (error) {
      _winston.default.error(error);

      (0, _response.default)(res, 500, error);
    }
  }

  static async deleteProduct(req, res) {
    try {} catch (error) {
      (0, _response.default)(res, 500, error);
    }
  }

  static async updateProduct(req, res) {
    try {} catch (error) {
      (0, _response.default)(res, 500, error);
    }
  }

}

var _default = CartController;
exports.default = _default;