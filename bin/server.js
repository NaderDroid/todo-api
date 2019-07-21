const express = require('express');
const logger = require('morgan');
const quotesRouter = require('../quotes');
const usersRouter = require('../routes/users');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const auth = require('./../lib/auth')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/mongoose-crud', {
    useNewUrlParser: true
})

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://naderdroid:002051@cluster0-j7ajx.gcp.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     if (err) return console.log(err)
//     const collection = client.db("test").collection("devices");
//     client.close()
//
const app = express();
// });
app.use((req, res, next) => {
    if (req.headers.authorization) {
        const auth = req.headers.authorization
        // if we find the Rails pattern in the header, replace it with the Express
        // one before `passport` gets a look at the headers
        req.headers.authorization = auth.replace('Token token=', 'Bearer ')
    }
    next()
})

// register passport authentication middleware
app.use(auth)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}))
app.use('/', quotesRouter);
app.use('/users', usersRouter);
app.use(logger('dev'));
app.listen('3003' , console.log("Listening on port 3003"))
