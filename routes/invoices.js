const db = require('../db');
const express = require('express');
const router = express.Router();

// Return info on invoices: like {invoices: [{id, comp_code}, ...]}
router.get('/', async function(req, res, next) {
  //   console.log('test');
  try {
    const results = await db.query(`SELECT * FROM invoices`);
    return res.json(results.rows);
  } catch (err) {
    return next(err);
  }
});

// Returns obj on given invoice. If invoice cannot be found, returns 404.
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    console.log(id);
    //prevent sql injection
    const results = await db.query(`SELECT * FROM invoices WHERE id = $1`, [
      id
    ]);
    if (results.rows.length === 0) {
      let err = new Error('Invoice not found');
      err.status = 404;
      throw err;
    }
    return res.json(results.rows[0]);
  } catch (err) {
    console.log('error');
    return next(err);
  }
});
//  Adds an invoice. Needs to be passed in JSON body of: {comp_code, amt}
// id, comp_code, amt, paid, add_date, paid_date
router.post('/', async function(req, res, next) {
  try {
    const { comp_code, amt, paid, paid_date } = req.body;
    const result = await db.query(
      `INSERT INTO invoices (comp_code, amt, paid,paid_date)
          VALUES($1, $2, $3, $4)
          RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [comp_code, amt, paid, paid_date]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    const { comp_code, amt, paid, paid_date } = req.body;
    const result = await db.query(
      `UPDATE invoices SET comp_code=$2, amt=$3, paid=$4, paid_date=$5
          WHERE id=$1
          RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [id, comp_code, amt, paid, paid_date]
    );
    console.log(result.rows);
    return res.json(result.rows[0]);
  } catch (err) {
    //should return 404 if not found
    return next(err);
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    const checkRes = await db.query(`SELECT * FROM invoices WHERE id = $1`, [
      id
    ]);
    if (checkRes.rows.length === 0) {
      let err = new Error('Invoice not found');
      err.status = 404;
      throw err;
    }
    const result = await db.query(`DELETE from invoices WHERE id=$1`, [id]);
    return res.json({ status: 'deleted' });
  } catch (err) {
    //should return 404 if not found
    return next(err);
  }
});

module.exports = router;
