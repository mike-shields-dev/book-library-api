const { Router } = require('express');
const readerController = require('../controllers/readerController');

const router = Router();

router.post('/', readerController.create)

module.exports = router;