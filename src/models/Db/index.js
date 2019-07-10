/* eslint-disable linebreak-style */
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import assert from 'assert';

dotenv.config();

export default new Promise(async (resolve, reject) => {
  const client = await MongoClient.connect(process.env.DATABASE_URI, { poolSize: 5, useNewUrlParser: true })
    .catch(err => reject(err));
  if (client) {
    return resolve(client.db());
  }
});
