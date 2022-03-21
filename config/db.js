/* eslint-disable no-unused-vars */
'use strict';
const dotenv = require('dotenv').config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    connection_string: process.env.DB_CONNECTION_STRING,
    security: process.env.DB_SECURITY,
  },
};

module.exports = config;
