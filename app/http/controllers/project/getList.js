const Joi = require('joi');

const projectService = require('../../services/project');
const { abort } = require('../../../helpers/error');

const validate = async ({ limit, offset }) => {
  try {
    const schema = Joi.object({
      limit: Joi.number().min(1).required(),
      offset: Joi.number().min(0).required(),
    });
    return await schema.validate({ limit, offset });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const getList = async (req, res) => {
  const { limit, offset } = req.query;
  const userId = req.user.id;
  await validate({ limit, offset });
  const tasks = await projectService.getList({
    userId,
    limit,
    offset,
  });
  res.status(200).send(tasks);
};

module.exports = getList;
