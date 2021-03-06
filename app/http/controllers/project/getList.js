const Joi = require('joi');

const projectService = require('../../services/project');
const { abort } = require('../../../helpers/error');

const validate = async ({
  limit, offset, sortType, sortBy,
}) => {
  try {
    const schema = Joi.object({
      limit: Joi.number().min(1).required(),
      offset: Joi.number().min(0).required(),
      sortBy: Joi.valid(['id', 'name', 'created_by', 'created_at']).required(),
      sortType: Joi.valid(['asc', 'desc']).required(),
    });
    return await schema.validate({
      limit, offset, sortType, sortBy,
    });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const getList = async (req, res) => {
  const {
    limit, offset, sortBy, sortType,
  } = req.query;
  const userId = req.user.id;
  await validate({
    limit, offset, sortBy, sortType,
  });
  const tasks = await projectService.getList({
    userId,
    limit,
    offset,
    sortBy,
    sortType,
  });
  res.status(200).send(tasks);
};

module.exports = getList;
