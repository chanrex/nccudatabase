'use strict';

const { doquery, client } = require('../../../config/postgresql');

const Router = require('express-promise-router');
const router = new Router();

router.get('/', (req, res) => {
  let { rows } = client.query('select * from book');
  res.json({
    status: 'success',
    data: rows,
  });
});

module.exports = router;
