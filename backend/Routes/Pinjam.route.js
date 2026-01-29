const express = require('express');
const { borrowBook, returnBook, getAllBorrowings } = require('../Controllers/Pinjam.controller');
const verifyToken = require('../Middewares/Verif.middleeware');
const router = express.Router();

router.use(verifyToken)
router.post('/borrow', borrowBook);
router.post('/return/:id', returnBook);
router.get('/', getAllBorrowings);

module.exports = router;