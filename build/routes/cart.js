"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _Authentication = _interopRequireDefault(require("../Authentication"));

var _Cart = _interopRequireDefault(require("../controllers/Cart"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable linebreak-style */
const router = _express.default.Router();

router.post('/:productId', _Authentication.default.verifyToken, _Cart.default.addToCart);
router.get('/', _Authentication.default.verifyToken, _Cart.default.getCart); // router.patch('/:productId/quantity', Authentication.verifyToken, CartController.updateQuantity);
// router.delete('/:productId', Authentication.verifyToken, CartController.deleteItem);

var _default = router;
exports.default = _default;