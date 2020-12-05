const Joi = require('joi');

const projectMemberService = require('../../services/project_member');
const { abort } = require('../../../helpers/error');

const validate = async ({ membersId, projectId }) => {
  try {
    const schema = Joi.object({
      projectId: Joi.number().required(),
      membersId: Joi.array().items(Joi.number().required()).required(),
    });
    return await schema.validate({ membersId, projectId });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const create = async (req, res) => {
  const { projectId } = req.params;
  const { membersId } = req.body;
  const userId = req.user.id;
  await validate({ membersId, projectId });
  await projectMemberService.addMember({
    userId,
    membersId,
    projectId,
  });
  res.status(201).send();
};

module.exports = create;
