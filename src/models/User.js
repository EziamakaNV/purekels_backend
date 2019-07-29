/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
import database from './Db/index';
import logger from '../config/winston';

let usersCollection;
(async () => {
  try {
    const db = await database.catch((err) => { throw new Error(err); });
    usersCollection = db.collection('users');
  } catch (error) {
    logger.error(error);
    usersCollection = false;
  }
})();

class UserModel {
  static findUser(email) {
    return new Promise(async (resolve, reject) => {
      if (usersCollection === false) { return reject(new Error('Db Connection failed')); }
      usersCollection.findOne({ email }).then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  static createUser(user) {
    return new Promise(async (resolve, reject) => {
      if (usersCollection === false) { return reject(new Error('Db Connection failed')); }
      usersCollection.insertOne({ ...user }).then(result => resolve(result.ops[0]))
        .catch(err => reject(err));
    });
  }

  static isAdmin(userId) {
  }
}

export default UserModel;
