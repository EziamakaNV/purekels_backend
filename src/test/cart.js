/* eslint-disable linebreak-style */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
import mocha from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import server from '../server';
import database from '../config/Db/index';
import logger from '../config/winston';

dotenv.config();

chai.use(chaiHttp);
const { expect } = chai;

let cartsCollection;
before(function (done) {
  database.then(function (db) {
    cartsCollection = db.collection('testCarts');
    done();
  }).catch(function (err) {
    logger.error(`Mocha Db Connection ${err}`);
    done();
  });
});

// token in cookies is the test user jamesp@hogwarts.com
// testUserId is the test user jamesp@hogwarts.com
const token = `jwt=${process.env.TEST_TOKEN}`;
const testUserId = process.env.TEST_USERID;
const deleteCartAfter = () => (
  after(function (done) {
    cartsCollection.findOneAndDelete({ owner: testUserId })
      .then(function () { done(); })
      .catch(function (err) {
        logger.error(`Mocha Test ${err}`);
        done();
      });
  })
);
const deleteCartBefore = () => (
  before(function (done) {
    cartsCollection.findOneAndDelete({ owner: testUserId })
      .then(function () { done(); })
      .catch(function (err) {
        logger.error(`Mocha Test ${err}`);
        done();
      });
  })
);
logger.info(token);

describe('GET /api/v1/cart 1st part', function () {
  before(function (done) {
    cartsCollection.insertOne({
      owner: testUserId,
      items: [
        {
          productId: 1,
          quantity: 1,
        },
      ],
    }).then(function () { done(); })
      .catch(function (err) {
        logger.error(`Mocha Test ${err}`);
        done();
      });
  });

  describe('When the user is logged in', function () {
    it('Should return an object with properties "status" and "data" on success if the user has a cart', function (done) {
      chai.request(server)
        .get('/api/v1/cart')
        .set('Cookie', token)
        .end(function (err, res) {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(200);
          expect(res.body).to.haveOwnProperty('data');
          expect(res.body.data).to.be.a('object');
          done();
        });
    });
  });

  after(function (done) {
    cartsCollection.findOneAndDelete({ owner: testUserId })
      .then(function () { done(); })
      .catch(function (err) {
        logger.error(`Mocha Test ${err}`);
        done();
      });
  });
});

describe('GET /api/v1/cart 2nd part', function () {
  deleteCartBefore();
  describe('When the user is logged in', function () {
    it('Should return a 200 and message "Nothing in cart" if no cart is found', function (done) {
      chai.request(server)
        .get('/api/v1/cart')
        .set('Cookie', token)
        .end(function (err, res) {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(200);
          expect(res.body).to.haveOwnProperty('data');
          expect(res.body.data.message).to.be.equal('Nothing in cart');
          done();
        });
    });
  });
});

describe('POST /api/v1/cart/:productId', function () {
  describe('When the user is logged in', function () {
    it('Should return a status of 200 and data property in the body', function (done) {
      chai.request(server)
        .post('/api/v1/cart/111111111111')
        .set('Cookie', token)
        .end(function (err, res) {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(200);
          expect(res.body).to.haveOwnProperty('data');
          expect(res.body.data).to.be.a('object');
          const cartItem = res.body.data.items.find(item => item.productId === 111111111111);
          expect(cartItem.productId).to.equal(111111111111);
          done();
        });
    });
  });
  deleteCartAfter();
});
