const Joi = require('joi');

const projectMemberService = require('../../services/project_member');
const { abort } = require('../../../helpers/error');

const validate = async ({ memberId, projectId }) => {
  try {
    const schema = Joi.object({
      projectId: Joi.number().required(),
      memberId: Joi.number().required(),
    });
    return await schema.validate({ memberId, projectId });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const create = async (req, res) => {
  const { memberId, projectId } = req.params;
  const userId = req.user.id;
  await validate({ memberId, projectId });
  await projectMemberService.addMember({
    userId,
    memberId,
    projectId,
  });
  res.status(201).send();
};

module.exports = create;
