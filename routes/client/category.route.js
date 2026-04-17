const router = require('express').Router();

const categoryController = require("../../controllers/client/category.controller");

router.get('/:slug', categoryController.list)

// router.post('/detail', cartController.detail)

module.exports = router;