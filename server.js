'use strict';

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require(process.cwd() + '/routes.js');
const dbConfig = require(process.cwd() + '/config/db');
const logger = require(process.cwd() + '/config/winston-config');

mongoose.connect(`mongodb://${dbConfig.db.user}:${dbConfig.db.password}@${dbConfig.db.connection_string}/${dbConfig.db.name}?${dbConfig.db.security}`,
{useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if (err) {
        logger.error({message: `Error in establishing a MongoDB Connection ${err}`});
      } else {
        logger.info({message: `Successfully established a MongoDB Connection ${Date()}`});
      }
    });

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('combined', {stream: logger.stream}));

// Initialising the routes
const router = express.Router();
routes.init(router);

// CORS Request
const originAllowed = process.env.ALLOWED_ORIGIN;

app.use(cors({
    origin: '*',
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'X-Requested-With'],
}));

app.use('/api', router);

app.listen(process.env.PORT);
logger.info({env: `Environment:- ${dbConfig.env}`, serverStatus: `Server started & Listening on PORT:- ${process.env.PORT}`});