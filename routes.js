'use strict';

exports.init = (router) => {
    router.route('/').get((req, res) => {
      res.send('Circle CI/ CD Dashboard');
    });
}