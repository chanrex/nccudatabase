'use strict';

const { client } = require('../../../config/postgresql');

const Router = require('express-promise-router');
const router = new Router();

router.get('/', (req, res) => {
  let { rows } = client.query('select * from book');
  res.json({
    status: 'success',
    data: rows,
  });
});

router.get('/authors', async (req, res) => {
  let { rows } = await client.query('select * from author');
  res.json({
    status: 'success',
    data: rows,
  });
});

router.get('/publishers', async (req, res) => {
  let { rows } = await client.query('select * from publisher');
  res.json({
    status: 'success',
    data: rows,
  });
});

router.get('/users', async (req, res) => {
  let { rows } = await client.query('select * from users');
  res.json({
    status: 'success',
    data: rows,
  });
});

router.get('/category', async (req, res) => {
  let { rows } = await client.query('select * from category');
  res.json({
    status: 'success',
    data: rows,
  });
});

router.get('/signin', async (req, res) => {
  let { account, password } = req.body;

  let { rows } = await client.query(
    'select * from users where user_name = $1 and user_password = $2',
    [account, password],
  );

  if (rows.length > 0) {
    res.json({
      status: 'success',
    });
  } else {
    res.json({
      status: 'failed',
    });
  }
});

module.exports = router;
