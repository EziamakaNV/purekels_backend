/* eslint-disable linebreak-style */
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import assert from 'assert';
import EventEmitter from 'events';

class MyEmitter extends EventEmitter {}

export const dbEmitter = new MyEmitter();
dotenv.config();

export default new Promise((resolve, reject) => {
  MongoClient.connect(process.env.DATABASE_URI, { poolSize: 5, useNewUrlParser: true })
    .then((client) => {
      if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
        dbEmitter.emit('db_connected');
      }
      return resolve(client.db());
    })
    .catch((err) => {
      dbEmitter.emit('error', new Error(err));
      reject(err);
    });
});
