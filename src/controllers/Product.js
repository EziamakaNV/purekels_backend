/* eslint-disable linebreak-style */
import response from '../response';
import ProductModel from '../models/Product';
import logger from '../config/winston';

class CartController {
  static async createProduct(req, res) {
    // Check if the product name already exists
    try {
      const { price, imageUrl } = req.body;
      const productName = req.body.productName.toLowerCase();
      const productExists = await ProductModel.find('name', productName);
      if (productExists) return response(res, 400, 'A product with the same name already exists');
      const newProduct = await ProductModel.createProduct(productName, price, imageUrl);
      return response(res, 201, newProduct);
    } catch (error) {
      return response(res, 500, error);
    }
  }

  static async getAllProducts(req, res) {
    try {
      // Check if the user has a cart
      const products = await ProductModel.getAll();
      return response(res, 200, products);
    } catch (error) {
      logger.error(error);
      return response(res, 500, error);
    }
  }

  static async updatePrice(req, res) {
    try {
      // Check if the product exists
      const { productId } = req.params;
      const { price } = req.body;
      const productExists = await ProductModel.find('id', productId);
      if (!productExists) return response(res, 400, 'Product does not exist');
      const updatedProduct = await ProductModel.updatePrice(productId, price);
      return response(res, 200, updatedProduct);
    } catch (error) {
      logger.error(error);
      return response(res, 500, error);
    }
  }

//   static async deleteProduct(req, res) {
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

export default CartController;
