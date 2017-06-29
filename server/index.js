const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');
const _ = require('lodash');
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')
const reflectionRouter = require('./routes/reflection')
const DATABASE_URL = process.env.DATABASE_URL

mongoose.Promise = global.Promise
app.use(cors())

function server() {
  //app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());


  userRouter(app)
  authRouter(app)
  reflectionRouter(app)

  app.use((err, req, res, next) => {
    if(err){
      console.log('Error middleware');
      let status = 500;
      const responseObject = {
        errorMessage: err.message
      };
      console.log('err.name:', typeof err.name);
      console.log('err.code:', typeof err.code);
      console.log('code is 11000: ', err.code === 11000);
      console.log('name is MongoError: ', err.name === 'MongoError');
      if((err.name === 'MongoError' && err.code === 11000) || err.code === 409){
        status = 409;
        if(_.has(err, 'attributeName')){
          responseObject.attributeName = err.attributeName;
        }
      }
        res.status(status).send(responseObject);


      next(err);
    }
  });

  app.listen(process.env.PORT || 8080, () => {
    /* eslint-disable no-console*/
    console.log(`listening on PORT:${process.env.PORT || 8080}`)
  })
}

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(DATABASE_URL || 'mongodb://localhost/mindful')
  mongoose.connection
    .once('open', () => { server() })
    .on('error', (error) => {
      /* eslint-disable no-console */
      console.warn('Warning', error)
    })
} else {
  server()
}


module.exports = app
