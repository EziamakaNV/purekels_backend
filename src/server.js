/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user';
import cartRoute from './routes/cart';
import { dbEmitter } from './models/Db/index';

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/v1/auth', userRoute);
app.use('/api/v1/cart', cartRoute);
// Not Found Handler
app.use((req, res) => { res.status(404).send('Not Found!'); });

// start the server only if the db is connected
dbEmitter.on('db_connected', () => {
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log('Db Connected, Emitter worked!');
    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
  }
});

dbEmitter.on('error', (err) => {
  console.log(`Error connecting to db - ${err}`);
});

export default app;