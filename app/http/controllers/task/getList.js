const Joi = require('joi');

const taskService = require('../../services/task');
const { abort } = require('../../../helpers/error');
const taskStatus = require('../../../enums/taskStatus');

const validate = async ({ limit, offset, status }) => {
  try {
    const schema = Joi.object({
      limit: Joi.number().min(1).required(),
      offset: Joi.number().min(0).required(),
      status: Joi
        .valid(
          taskStatus.getValues(),
        ),
    });
    return await schema.validate({ limit, offset, status });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const getList = async (req, res) => {
  const { status, limit, offset } = req.query;
  const { projectId } = req.params;
  const userId = req.user.id;
  await validate({ status: Number(status), limit, offset });
  const tasks = await taskService.getList({
    userId,
    status,
    projectId,
    limit,
    offset,
  });
  res.status(200).send(tasks);
};

module.exports = getList;
