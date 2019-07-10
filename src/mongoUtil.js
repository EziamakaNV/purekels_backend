/* eslint-disable linebreak-style */
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import assert from 'assert';

dotenv.config();

// export default new Promise(async (resolve, reject) => {
//   const client = await MongoClient.connect(process.env.DATABASE_URI, { poolSize: 5, useNewUrlParser: true })
//     .catch(err => reject(err));
//   return resolve(client.db());
// });
let db;
export default {
  connectToServer: () => new Promise(async (resolve, reject) => {
    const client = await MongoClient.connect(process.env.DATABASE_URI, { poolSize: 5, useNewUrlParser: true })
      .catch(err => reject(err));
    db = client.db();
    console.log(1);
    return resolve(client);
  }),
  getDb: () => db,
};
