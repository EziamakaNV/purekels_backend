/* eslint-disable linebreak-style */
import express from 'express';
import Authentication from '../Authentication';
import CartController from '../controllers/Cart';

const router = express.Router();

router.post('/:productId', Authentication.verifyToken, CartController.addToCart);

// router.get('/', Authentication.verifyToken, CartController.getCart);

// router.patch('/:productId/quantity', Authentication.verifyToken, CartController.updateQuantity);

// router.delete('/:productId', Authentication.verifyToken, CartController.deleteItem);

export default router;
