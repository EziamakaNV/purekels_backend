"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _Authentication = _interopRequireDefault(require("../Authentication"));

var _Product = _interopRequireDefault(require("../controllers/Product"));

var _validations = _interopRequireDefault(require("../middleware/validations"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable linebreak-style */
const router = _express.default.Router();

router.post('/', _Authentication.default.verifyToken, _validations.default.createProduct, _Product.default.createProduct); // router.get('/', Authentication.verifyToken, CartController.getCart);
// router.patch('/:productId/decrement', Authentication.verifyToken, Validation.addOrDeductFromCart, CartController.addOrDeductFromCart);
// router.delete('/:productId', Authentication.verifyToken, Validation.addOrDeductFromCart, CartController.deleteFromCart);
// router.patch('/:productId/quantity/:quantity', Authentication.verifyToken, Validation.updateProductByQuantity, CartController.updateByQuantity);

var _default = router;
exports.default = _default;