/* eslint-disable linebreak-style */
import express from 'express';
import Authentication from '../Authentication';
import CartController from '../controllers/Cart';
import Validation from '../middleware/validations';

const router = express.Router();

router.post('/:productId', Authentication.verifyToken, Validation.addOrDeductFromCart, CartController.addOrDeductFromCart);

router.get('/', Authentication.verifyToken, CartController.getCart);

router.patch('/:productId/decrement', Authentication.verifyToken, Validation.addOrDeductFromCart, CartController.addOrDeductFromCart);

router.delete('/:productId', Authentication.verifyToken, Validation.addOrDeductFromCart, CartController.deleteFromCart);

export default router;
