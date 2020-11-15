const Joi = require('joi');

const taskService = require('../../services/task');
const { abort } = require('../../../helpers/error');
const taskStatus = require('../../../enums/taskStatus');
const taskPriority = require('../../../enums/taskPriority');

const validate = async ({
  name, description, status, priority, projectId, taskId,
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
    });
    return await schema.validate({
      name, description, status, priority, projectId, taskId,
    });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const update = async (req, res) => {
  const {
    name, description, status, priority,
  } = req.body;
  const { projectId, taskId } = req.params;
  const userId = req.user.id;

  await validate({
    name, description, status, priority, projectId, taskId,
  });
  await taskService.update({
    taskId,
    projectId,
    userId,
    name,
    description,
    status,
    priority,
  });
  res.status(204).send();
};

module.exports = update;
