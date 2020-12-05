const express = require('express');

const {
  project: projectController,
  project_member: ProjectMemberController,
} = require('../http/controllers');
const { auth } = require('../http/middlewares');

const router = express.Router();

router.post('/projects', auth, projectController.create);
router.get('/projects/created', auth, projectController.getList);
router.get('/projects', auth, ProjectMemberController.getListProject);
router.put('/projects/:projectId', auth, projectController.update);
router.delete('/projects/:projectId', auth, projectController.remove);

module.exports = router;
