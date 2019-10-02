/* eslint-disable linebreak-style */
import express from 'express';
import Authentication from '../Authentication';
import ProductController from '../controllers/Product';
import Validation from '../middleware/validations';

const router = express.Router();

router.post('/', Authentication.verifyToken, Validation.createProduct, ProductController.createProduct);


router.get('/', Authentication.verifyToken, ProductController.getAllProducts);

router.patch('/:productId/price', Authentication.verifyToken, Validation.updateProductPrice, ProductController.updatePrice);

// router.delete('/:productId', Authentication.verifyToken, Validation.addOrDeductFromCart, CartController.deleteFromCart);

// router.patch('/:productId/quantity/:quantity', Authentication.verifyToken, Validation.updateProductByQuantity, CartController.updateByQuantity);

export default router;
