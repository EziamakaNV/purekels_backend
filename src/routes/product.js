/* eslint-disable linebreak-style */
import express from 'express';
import Authentication from '../Authentication';
import CartController from '../controllers/Product';
import Validation from '../middleware/validations';

const router = express.Router();

router.post('/', Authentication.verifyToken, Validation.createProduct, CartController.createProduct);


// router.get('/', Authentication.verifyToken, CartController.getCart);

// router.patch('/:productId/decrement', Authentication.verifyToken, Validation.addOrDeductFromCart, CartController.addOrDeductFromCart);

// router.delete('/:productId', Authentication.verifyToken, Validation.addOrDeductFromCart, CartController.deleteFromCart);

// router.patch('/:productId/quantity/:quantity', Authentication.verifyToken, Validation.updateProductByQuantity, CartController.updateByQuantity);

export default router;
