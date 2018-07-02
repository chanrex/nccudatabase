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

router.get('/books', async (req, res) => {
  // let query = `select * from books bks
  //   left join (select book_id, array_agg(category_name) from books_category left join category c2 on books_category.category_id = c2.id group by books_category.book_id) nt on bks.id = nt.book_id
  //   left join author a on bks.author_id = a.id
  //   left join publisher p on bks.publisher_id = p.id`;

  let query = `
    select * from user_book
      left join
        (select *, bks.id as booksid_id from books bks
            left join (select book_id, array_agg(category_name) from books_category left join category c2 on books_category.category_id = c2.id group by books_category.book_id) nt on bks.id = nt.book_id
            left join author a on bks.author_id = a.id
            left join publisher p on bks.publisher_id = p.id)
        b on user_book.book_id = b.booksid_id`;
  let { rows } = await client.query(query);
  res.json({
    status: 'success',
    data: rows,
  });
});

router.get('/myPurchase/:user_id', async (req, res) => {
  let query = `
    select * from user_book
      left join
        (select *, bks.id as booksid_id from books bks
            left join (select book_id, array_agg(category_name) from books_category left join category c2 on books_category.category_id = c2.id group by books_category.book_id) nt on bks.id = nt.book_id
            left join author a on bks.author_id = a.id
            left join publisher p on bks.publisher_id = p.id)
        b on user_book.book_id = b.booksid_id
    where user_book.user_id = $1`;
  let { rows } = await client.query(query, [req.params.user_id]);
  res.json({
    status: 'success',
    data: rows,
  });
});

router.post('/purchase', async (req, res) => {
  console.log(req.body);
  let query = `update user_book set buyer_id = $1, sold = true where book_id = $2`;
  let result = await client.query(query, [req.body.buyer_id, req.body.book_id]);
  res.json({
    status: 'success',
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

router.get('/categorys', async (req, res) => {
  let { rows } = await client.query(
    `select * from category where status = '1'`,
  );
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
    category_array,
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

  console.log('user_book result', result.rows);

  for (let i = 0; i < category_array.length; i++) {
    let categoryQuery = `insert into books_category (book_id, category_id) values ($1, $2) returning *`;

    let { rows } = await client.query(categoryQuery, [id, category_array[i]]);
  }

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
