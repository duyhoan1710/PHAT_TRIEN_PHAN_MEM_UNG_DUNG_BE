const Joi = require('joi');

const projectMemberService = require('../../services/project_member');
const { abort } = require('../../../helpers/error');

const validate = async ({ limit, offset, projectId }) => {
  try {
    const schema = Joi.object({
      limit: Joi.number().min(1).required(),
      offset: Joi.number().min(0).required(),
      projectId: Joi.number().required(),
    });
    return await schema.validate({ limit, offset, projectId });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const getListMember = async (req, res) => {
  const { limit, offset } = req.query;
  const { projectId } = req.params;
  const userId = req.user.id;
  await validate({ limit, offset, projectId });
  const members = await projectMemberService.getListMember({
    userId,
    projectId,
    limit,
    offset,
  });
  res.status(200).send(members);
};

module.exports = getListMember;
