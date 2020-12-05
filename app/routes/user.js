const express = require('express');
const { user: userController } = require('../http/controllers');
const { auth } = require('../http/middlewares');

const router = express.Router();

router.put('/users', auth, userController.update);
router.get('/users', auth, userController.getList);

module.exports = router;
