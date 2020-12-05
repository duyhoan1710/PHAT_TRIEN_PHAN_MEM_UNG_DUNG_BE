const Joi = require('joi');

const taskService = require('../../services/task');
const { abort } = require('../../../helpers/error');
const taskStatus = require('../../../enums/taskStatus');
const taskPriority = require('../../../enums/taskPriority');

const validate = async ({
  name, description, status, priority, projectId, taskId, assignId,
}) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow(''),
      status: Joi
        .valid(
          taskStatus.getValues(),
        ),
      priority: Joi
        .valid(
          taskPriority.getValues(),
        ),
      projectId: Joi.number().min(1).required(),
      taskId: Joi.number().min(1).required(),
      assignId: Joi.number().allow(null),
    });
    return await schema.validate({
      name, description, status, priority, projectId, taskId, assignId,
    });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const update = async (req, res) => {
  const {
    name, description, status, priority, assignId,
  } = req.body;
  const { projectId, taskId } = req.params;
  const userId = req.user.id;

  await validate({
    name, description, status, priority, projectId, taskId, assignId,
  });
  await taskService.update({
    taskId,
    projectId,
    userId,
    name,
    description,
    status,
    priority,
    assignId,
  });
  res.status(204).send();
};

module.exports = update;
