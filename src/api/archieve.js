'use strict';

const { client } = require('../../../config/postgresql');

const Router = require('express-promise-router');
const router = new Router();

router.get('/category/insert', async (req, res) => {
  var category = [
    '文學小說',
    '商業理財',
    '藝術設計',
    '人文史地',
    '社會科學',
    '自然科普',
    '心理勵志',
    '醫療保健',
    '飲食',
    '生活風格',
    '旅遊',
    '宗教命理',
    '親子教養',
    '童書/青少年文學',
    '輕小說',
    '漫畫',
    '語言學習',
    '考試用書',
    '電腦資訊',
    '專業/教科書/政府出版品',
  ];

  let result = [];
  for (let i = 0; i < category.length; i++) {
    let { rows } = await client.query(
      'insert into category (category_name) values ($1)',
      [category[i]],
    );
    result.push(rows[0]);
  }

  res.json({
    status: 'success',
    data: result,
  });
});

module.exports = router;
