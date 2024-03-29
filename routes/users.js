const express = require('express');
const crypto = require('crypto');
const passport = require('passport');
const bcrypt = require('bcrypt');
const bcryptSaltRounds = 10;
const errors = require('../lib/errors');
const BadParamsError = errors.BadParamsError;
const BadCredentialsError = errors.BadCredentialsError;
const requireToken = passport.authenticate('bearer', { session: false });
const router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('This will render users page');
});

router.post('/sign-up', (req, res, next) => {
  Promise.resolve(req.body.credentials)
      .then(credentials => {
        if (!credentials ||
            !credentials.password ||
            credentials.password !== credentials.password_confirmation) {
          throw new BadParamsError()
        }
      })
      .then(() => bcrypt.hash(req.body.credentials.password, bcryptSaltRounds))
      .then(hash => {
        return {
          username: req.body.credentials.username,
          password: hash
        }
      })
      .then(user => User.create(user))
      .then(user => res.status(201).json({ user: user.toObject() }))
      .catch(next)
})

// SIGN IN
// POST /sign-in
router.post('/sign-in', (req, res, next) => {
  const pw = req.body.credentials.password
  let user

  User.findOne({ username: req.body.credentials.username })
      .then(record => {
        if (!record) {
          throw new BadCredentialsError()
        }
        user = record
        return bcrypt.compare(pw, user.password)
      })
      .then(correctPassword => {
        if (correctPassword) {
          const token = crypto.randomBytes(16).toString('hex')
          user.token = token
          return user.save()
        } else {
          throw new BadCredentialsError()
        }
      })
      .then(user => {
        res.status(201).json({ user: user.toObject() })
      })
      .catch(next)
})

// CHANGE password
// PATCH /change-password
router.patch('/change-password', requireToken, (req, res, next) => {
  let user
    //console.log(req.body)
  User.findById(req.user.id)
      .then(record => { user = record })
      .then(() => bcrypt.compare(req.body.passwords.old, user.password))
      .then(correctPassword => {
        if (!req.body.passwords.new || !correctPassword) {
          throw new BadParamsError()
        }
      })
      .then(() => bcrypt.hash(req.body.passwords.new, bcryptSaltRounds))
      .then(hash => {
        user.password = hash
        return user.save()
      })
      .then(() => res.sendStatus(204))
      .catch(next)
})

router.delete('/sign-out', requireToken, (req, res, next) => {
  req.user.token = crypto.randomBytes(16)
  req.user.save()
      .then(() => res.sendStatus(204))
      .catch(next)
})



module.exports = router;
