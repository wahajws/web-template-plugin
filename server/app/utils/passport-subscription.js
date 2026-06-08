'use strict';

const passport = require('passport');
const Subscription = require('../app/models/subscription');
const auth = require('../app/middleware/auth');
const JwtStrategy = require('passport-jwt').Strategy;

/**
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string} token - decrypted token
 */
const jwtExtractor = (req) => {
  let token = null;
  if (req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '').trim();
  } else if (req.body.token) {
    token = req.body.token.trim();
  } else if (req.query.token) {
    token = req.query.token.trim();
  }
  if (token) {
    // Decrypts token
    token = auth.decrypt(token);
  }
  return token;
}

/**
 * Options object for jwt middlware
 */
const jwtOptions = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: process.env.JWT_SECRET
};

/**
 * Login with JWT middleware
 */
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  Subscription.findById(payload.data._id, (err, subscription) => {
    if (err) {
      return done(err, false);
    }
    return !subscription ? done(null, false) : done(null, subscription);
  })
});

passport.use(jwtLogin);
