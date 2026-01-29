const express = require('express')

const { getAllCategories, getCategoryById, createCategory, editCategory, deleteCategory } = require('../Controllers/category.controller');
const roleMiddleware = require('../Middewares/role.middleware');
const verifyToken = require('../Middewares/Verif.middleeware');
const router = express.Router();

router.get('/', getAllCategories);
router.use(verifyToken);
router.post('/', createCategory);
// router.use(roleMiddleware(['admin_perpon']));
router.put('/:id', editCategory);
router.delete('/:id', deleteCategory);

module.exports = router;