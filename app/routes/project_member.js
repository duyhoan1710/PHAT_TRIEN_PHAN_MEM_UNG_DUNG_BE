const express = require('express');

const { project_member: projectMemberController } = require('../http/controllers');
const { auth } = require('../http/middlewares');

const router = express.Router();

router.post('/projects/:projectId/members', auth, projectMemberController.addMember);
router.get('/projects/:projectId/members', auth, projectMemberController.getListMember);
router.delete('/projects/:projectId/members/:memberId', auth, projectMemberController.removeMember);

module.exports = router;
