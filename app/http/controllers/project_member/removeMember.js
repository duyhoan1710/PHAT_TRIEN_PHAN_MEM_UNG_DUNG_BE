const Joi = require('joi');

const projectMemberService = require('../../services/project_member');
const { abort } = require('../../../helpers/error');

const validate = async ({ projectId, memberId }) => {
  try {
    const schema = Joi.object({
      projectId: Joi.number().min(1).required(),
      memberId: Joi.number().min(1).required(),
    });
    return await schema.validate({ projectId, memberId });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const removeMember = async (req, res) => {
  const { projectId, memberId } = req.params;
  const userId = req.user.id;

  await validate({ projectId, memberId });
  await projectMemberService.removeMember({
    projectId,
    memberId,
    userId,
  });
  res.status(204).send();
};

module.exports = removeMember;
