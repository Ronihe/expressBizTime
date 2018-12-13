const db = require('../db');
const express = require('express');
const router = express.Router();

//Returns list of companies, like {companies: [{code, name}, ...]}
// need to use the async
router.get('/', async function(req, res, next) {
  console.log('test');
  try {
    const results = await db.query(`SELECT * FROM companies`);
    return res.json(results.rows);
  } catch (err) {
    return next(err);
  }
});

router.get('/:code', async function(req, res, next) {
  try {
    let code = req.params.code;
    console.log(code);
    //prevent sql injection
    const results = await db.query(`SELECT * FROM companies WHERE code = $1`, [
      code
    ]);
    return res.json(results.rows[0]);
  } catch (err) {
    console.log('error');
    return next(err);
  }
});

router.post('/', async function(req, res, next) {
  try {
    const { code, name, description } = req.body;
    const result = await db.query(
      `INSERT INTO companies (code, name, description)
        VALUES($1, $2, $3)
        RETURNING code, name, description`,
      [code, name, description]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});
router.put('/:code', async function(req, res, next) {
  try {
    let code = req.params.code;
    const { name, description } = req.body;
    const result = await db.query(
      `UPDATE companies SET name=$2, description=$3
        WHERE code=$1
        RETURNING code, name, description`,
      [code, name, description]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    //should return 404 if not found
    return next(err);
  }
});
router.delete('/:code', async function(req, res, next) {
  try {
    let code = req.params.code;
    const result = await db.query(`DELETE from companies WHERE code=$1`, [
      code
    ]);
    return res.json({ status: 'deleted' });
  } catch (err) {
    //should return 404 if not found
    return next(err);
  }
});

module.exports = router;
