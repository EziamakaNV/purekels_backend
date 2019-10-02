"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _validations = _interopRequireDefault(require("../middleware/validations"));

var _User = _interopRequireDefault(require("../controllers/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable linebreak-style */
const router = _express.default.Router();

router.post('/signup', _validations.default.signUpValidation, _User.default.signup);
router.post('/signin', _validations.default.loginValidation, _User.default.signin);
var _default = router;
exports.default = _default;