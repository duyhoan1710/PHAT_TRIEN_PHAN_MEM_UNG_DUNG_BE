const Joi = require('joi');

const projectMemberService = require('../../services/project_member');
const { abort } = require('../../../helpers/error');

const validate = async ({
  limit, offset, sortBy, sortType,
}) => {
  try {
    const schema = Joi.object({
      limit: Joi.number().min(1).required(),
      offset: Joi.number().min(0).required(),
      sortBy: Joi.valid(['id', 'name', 'created_by', 'created_at']).required(),
      sortType: Joi.valid(['asc', 'desc']).required(),
    });
    return await schema.validate({
      limit, offset, sortBy, sortType,
    });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const getListProject = async (req, res) => {
  const {
    limit, offset, sortBy, sortType,
  } = req.query;
  const userId = req.user.id;
  await validate({
    limit, offset, sortBy, sortType,
  });
  const tasks = await projectMemberService.getListProject({
    userId,
    limit,
    offset,
    sortBy,
    sortType,
  });
  res.status(200).send(tasks);
};

module.exports = getListProject;
