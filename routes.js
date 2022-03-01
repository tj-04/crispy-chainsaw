'use strict';

const cM = require('./controllers/implio-fileupload');
const cM1 = require('./controllers/implio1');

exports.init = (router) => {
    router.route('/').get((req, res) => {
      res.send('Implio Dashboard');
    });

    router.route('/bd').post(cM.createPost);
    router.route('/b1').post(cM1.createPost);
}