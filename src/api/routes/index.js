'use strict';

const express = require('express');
// const doquery = require('../../../config/db');

const { doquery } = require('../../../config/postgresql');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    data: 'welcome to backend'
  })
})

module.exports = router;
