const Joi = require('joi');

const taskService = require('../../services/task');
const { abort } = require('../../../helpers/error');
const taskStatus = require('../../../enums/taskStatus');

const validate = async ({
  limit, offset, status, projectId,
}) => {
  try {
    const schema = Joi.object({
      limit: Joi.number().min(1).required(),
      offset: Joi.number().min(0).required(),
      status: Joi
        .valid(
          taskStatus.getValues(),
        ),
      projectId: Joi.number().min(1).required(),

    });
    return await schema.validate({
      limit, offset, status, projectId,
    });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const getList = async (req, res) => {
  const { status, limit, offset } = req.query;
  const { projectId } = req.params;
  const userId = req.user.id;
  await validate({
    status: Number(status), limit, offset, projectId,
  });
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
