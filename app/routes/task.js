const express = require('express');

const { task: taskController } = require('../http/controllers');
const { auth } = require('../http/middlewares');

const router = express.Router();

router.post('/projects/:projectId/tasks', auth, taskController.create);
router.get('/projects/:projectId/tasks', auth, taskController.getList);
router.put('/projects/:projectId/tasks/:taskId', auth, taskController.update);
router.delete('/projects/:projectId/tasks/:taskId', auth, taskController.remove);

module.exports = router;
