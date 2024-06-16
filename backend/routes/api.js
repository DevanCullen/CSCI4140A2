const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

//connect to database db.cs.dal.ca
const db = mysql.createConnection({

    host: 'db.cs.dal.ca',
    user: 'dcullen',
    password: 'B00860113',
    database: 'dcullen'

});

//Lists all parts for sale
router.get('/parts', (req, res) => {

db.query('SELECT * FROM Parts113', (err, results) => {

     if (err) throw err;

     res.json(results);
    });
});

//Lists purchase orders without lines
router.get('/purchase-orders', (req, res) => {

    db.query('SELECT * FROM POs113', (err, results) => {

        if (err) throw err;

        res.json(results);

    });
});

//Lists all info about a purchase order
router.get('/purchase-orders/:poNumber', (req, res) => {

    const { poNumber } = req.params;

    const poQuery = 'SELECT * FROM POs113 WHERE poNo113 = ?';
    const lineQuery = 'SELECT * FROM Lines113 WHERE poNo113 = ?';

    db.query(poQuery, [poNumber], (err, poResults) => {

  if (err) {

            console.error('Error querying POs113:', err);
            res.status(500).send('Server error');
            return;

        }
        db.query(lineQuery, [poNumber], (err, lineResults) => {

     if (err) {

                console.error('Error querying Lines113:', err);
                res.status(500).send('Server error');
                return;

            }

            res.json({ ...poResults[0], lines: lineResults });

        });
    });
});

//Prepare a purchase order
router.post('/prepare-po113', (req, res) => { 
    const { clientCompID113, dateOfPO113, qty113, partNo113 } = req.body;

    console.log('Received request to prepare PO:', req.body);

    const insertPO = 'INSERT INTO POs113 (clientCompID113, dateOfPO113, status113) VALUES (?, ?, "Pending")';

    db.query(insertPO, [clientCompID113, dateOfPO113], (err, poResult) => {
        
    if (err) {

            console.error('Error inserting PO:', err);
            return res.status(500).json({ message: 'Internal server error while inserting PO', error: err.message });

        }

        const poNumber = poResult.insertId;
        const insertLine = 'INSERT INTO Lines113 (poNo113, lineNo113, partNo113, qty113, priceOrdered113) VALUES (?, 1, ?, ?, (SELECT currentPrice113 FROM Parts113 WHERE partNo113 = ?))';

        db.query(insertLine, [poNumber, partNo113, qty113, partNo113], (err, lineResult) => {

    if (err) {

                console.error('Error inserting line item:', err);
                return res.status(500).json({ message: 'Internal server error while inserting line item', error: err.message });

            }

            res.json({ poNumber });

        });
    });
});

//Submitting a purchase order
router.put('/purchase-orders113/:poNumber', (req, res) => { 

    const { poNumber } = req.params;
    const updatePOStatus = 'UPDATE POs113 SET status113 = "Submitted" WHERE poNo113 = ?';

    db.query(updatePOStatus, [poNumber], (err) => {

     if (err) {

            console.error('Error updating POs113:', err);
            res.status(500).send('Server error');

            return;

        }

        res.json({ success: true, poNumber });
        
    });
});

module.exports = router;
