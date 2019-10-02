/* eslint-disable linebreak-style */
import response from '../response';
import ProductModel from '../models/Product';
import logger from '../config/winston';

class CartController {
  static async createProduct(req, res) {
    // Check if the product name already exists
    try {
      const { price, imageUrl } = req.body;
      const productName = req.body.productName.replace(/\s/g, '').toLowerCase();
      const productExists = await ProductModel.find('name', productName);
      if (productExists) return response(res, 400, 'A product with the same name already exists');
      const newProduct = await ProductModel.createProduct(productName, price, imageUrl);
      return response(res, 201, newProduct);
    } catch (error) {
      return response(res, 500, error);
    }
  }

  static async getProduct(req, res) {
    try {
      // Check if the user has a cart
    } catch (error) {
      logger.error(error);
      response(res, 500, error);
    }
  }

  static async deleteProduct(req, res) {
    try {
      
    } catch (error) {
      response(res, 500, error);
    }
  }

  static async updateProduct(req, res) {
    try {
      
    } catch (error) {
      response(res, 500, error);
    }
  }
}

export default CartController;
