const express = require('express');
const passport = require('passport');
const router = express.Router();
const Todo = require('./models/todo');
const errors = require('./lib/errors');
const customErrors = require('./lib/custom_errors');
const requireOwnership = customErrors.requireOwnership;
const removeBlanks = require('./lib/remove_blanks');
const requireToken = passport.authenticate('bearer', { session: false })


//todo This app is running and the next thing to do is to have user auth and design the front end part

/* GET home page. */
router.get('/', (req, res, next) => {
   //res.send('Welcome to home directory');

  res.sendFile( '/index.html' ,
      {root : '/Users/naderalthubaity/WebstormProjects/todo-api/'})
});

router.get('/quotes/all' , requireToken , (req , res , next) => {
  Todo.find()
      .then(todos => res.status(200).json({todos : todos}))
      .catch(next)

})

router.get('/quotes/:id' , requireToken , (req , res , next) => {
  const id = req.params.id
  Todo.findById(id)
      .then(todo => res.status(200).json({todo : todo}))
      .catch(next)
})

router.post('/quotes' , requireToken , (req , res , next) => {
  req.body.todo.owner = req.user.id

  Todo.create(req.body.todo)
      .then(todo => {
        res.status(201).json({ todo: todo.toObject() })
      })
      .catch(next)
})

router.patch('/quotes/:id' , requireToken , removeBlanks , (req , res , next) => {
  const id = req.params.id

  Todo.findById(id)
      .then(errors.handle404)
      .then(todo => {
        requireOwnership(req , todo)
        return todo.update(req.body.todo)
      })
      .then(res.sendStatus(201))
      .catch(next)
})

router.delete('/quotes/:id' , requireToken , (req , res , next) => {
  const id = req.params.id
  Todo.findById(id)
      .then(todo => {
        requireOwnership(req , todo)
        return todo.remove()
      })
      .then(() => console.log('Item has been deleted'))
      .then(res.sendStatus(204))
      .catch(next)
})
router.get('/nader' , (req , res , next) => {
  res.send('This seems like it is working. Last time to be tested')
})
module.exports = router;
