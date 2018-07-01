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
  let { rows } = await client.query(`select * from author where status = '1'`);
  res.json({
    status: 'success',
    data: rows,
  });
});

router.get('/publishers', async (req, res) => {
  let { rows } = await client.query(
    `select * from publisher where status ='1'`,
  );
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

router.post('/addBook', async (req, res) => {
  console.log(req.body);
  let {
    book_name,
    book_title,
    book_description,
    book_publish_date,
    book_isbn,
    book_price,
    author_id,
    publisher_id,
    user_id,
  } = req.body;

  let book_query = `insert into books (book_name, book_title, book_description, book_publish_date, book_isbn, book_price, author_id, publisher_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning *`;
  let { rows } = await client.query(book_query, [
    book_name,
    book_title,
    book_description,
    book_publish_date,
    book_isbn,
    book_price,
    author_id,
    publisher_id,
  ]);
  console.log('step 1', rows);

  let { id } = rows[0];

  let user_book_query = `insert into user_book (user_id, book_id) VALUES ($1, $2) returning *`;

  let result = await client.query(user_book_query, [user_id, id]);
  console.log('final result', result.rows);

  res.json({
    status: 'success',
    data: result.rows,
  });
});

router.post('/signin', async (req, res) => {
  let { email, password } = req.body;
  console.log('inside signIn', req.body);

  let { rows } = await client.query(
    'select * from users where user_email = $1 and user_password = $2',
    [email, password],
  );

  if (rows.length > 0) {
    res.json({
      status: 'success',
      data: rows[0],
    });
  } else {
    res.json({
      status: 'failed',
      data: null,
    });
  }
});

module.exports = router;
