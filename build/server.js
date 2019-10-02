"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _user = _interopRequireDefault(require("./routes/user"));

var _cart = _interopRequireDefault(require("./routes/cart"));

var _product = _interopRequireDefault(require("./routes/product"));

var _index = require("./config/Db/index");

var _winston = _interopRequireDefault(require("./config/winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */

/* eslint-disable linebreak-style */

/* eslint-disable eol-last */
require('dotenv').config();

const app = (0, _express.default)();
const PORT = process.env.PORT || 8080;
process.title = 'purelykels';
app.use((0, _cookieParser.default)());
app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.use((0, _morgan.default)('combined', {
  stream: _winston.default.stream
}));
app.use(_express.default.static('public'));
app.use('/api/v1/auth', _user.default);
app.use('/api/v1/cart', _cart.default);
app.use('/api/v1/product', _product.default); // Not Found Handler

app.use((req, res) => {
  res.status(404).send('Not Found!');
}); // start the server only if the db is connected

_index.dbEmitter.on('db_connected', () => {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    _winston.default.info('Db Connected, Emitter worked!');

    app.listen(PORT, () => _winston.default.info("App listening on port ".concat(PORT)));
  }
});

_index.dbEmitter.on('error', err => {
  _winston.default.info("Error connecting to db - ".concat(err));
});

var _default = app;
exports.default = _default;