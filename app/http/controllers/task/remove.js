const Joi = require('joi');

const taskService = require('../../services/task');
const { abort } = require('../../../helpers/error');

const validate = async ({ taskId, projectId }) => {
  try {
    const schema = Joi.object({
      taskId: Joi.number().min(1).required(),
      projectId: Joi.number().min(1).required(),
    });
    return await schema.validate({ taskId, projectId });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const remove = async (req, res) => {
  const { projectId, taskId } = req.params;
  const userId = req.user.id;

  await validate({ taskId, projectId });
  await taskService.remove({
    taskId,
    projectId,
    userId,
  });
  res.status(204).send();
};

module.exports = remove;
