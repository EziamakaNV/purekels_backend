/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoute from './routes/user';
import cartRoute from './routes/cart';
import { dbEmitter } from './models/Db/index';
import winston from './config/winston';

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 8080;
process.title = 'purelykels';

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: winston.stream }));
app.use(express.static('public'));

app.use('/api/v1/auth', userRoute);
app.use('/api/v1/cart', cartRoute);
// Not Found Handler
app.use((req, res) => { res.status(404).send('Not Found!'); });

// start the server only if the db is connected
dbEmitter.on('db_connected', () => {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    winston.info('Db Connected, Emitter worked!');
    app.listen(PORT, () => winston.info(`App listening on port ${PORT}`));
  }
});

dbEmitter.on('error', (err) => {
  winston.info(`Error connecting to db - ${err}`);
});

export default app;