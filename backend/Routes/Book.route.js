const express = require('express');
const { getAllBooks, getBookById, getBookByCategory, createBook, updateBook, DeleteBook } = require('../Controllers/Book.controller');
const upload = require('../Middewares/upload.middleware');
const roleMiddleware = require('../Middewares/role.middleware');
const verifyToken = require('../Middewares/Verif.middleeware');
const router = express.Router();

router.get('/', getAllBooks);
router.get('/category/:id', getBookByCategory);
router.get('/:id', getBookById);
router.use(verifyToken);
// router.use(roleMiddleware(['admin_perpon']));
router.post('/',upload.single('gambar'), createBook);
router.put('/:id',upload.single('gambar'), updateBook);
router.delete('/:id', DeleteBook);

module.exports = router;
