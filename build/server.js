"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _user = _interopRequireDefault(require("./routes/user"));

var _mongoUtil = _interopRequireDefault(require("./mongoUtil"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable linebreak-style */

/* eslint-disable no-console */

/* eslint-disable linebreak-style */

/* eslint-disable eol-last */
require('dotenv').config();

const app = (0, _express.default)();
const PORT = process.env.PORT || 5000;

try {
  // Ensure the db is connected before starting the app
  _mongoUtil.default.connectToServer(err => {
    if (err) {
      throw new Error(err);
    } else {
      app.use((0, _cookieParser.default)());
      app.use(_bodyParser.default.json());
      app.use(_bodyParser.default.urlencoded({
        extended: true
      }));
      app.use(_express.default.static('public'));
      app.use('/api/v1/auth', _user.default); // Not Found Handler

      app.use((req, res) => {
        res.status(404).send('Not Found!');
      });

      if (process.env.NODE_ENV !== 'test') {
        // eslint-disable-next-line no-console
        app.listen(PORT, () => console.log("App listening on port ".concat(PORT)));
      }
    }
  });
} catch (error) {
  console.log(error);
}

var _default = app;
exports.default = _default;