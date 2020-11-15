const Joi = require('joi');

const taskService = require('../../services/task');
const { abort } = require('../../../helpers/error');
const taskPriority = require('../../../enums/taskPriority');

const validate = async ({
  name, description, priority, projectId,
}) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow(''),
      priority: Joi.number()
        .valid(
          taskPriority.getValues(),
        ),
      projectId: Joi.number().required(),
    });
    return await schema.validate({
      name, description, priority, projectId,
    });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const create = async (req, res) => {
  const { name, description, priority } = req.body;
  const { projectId } = req.params;
  const userId = req.user.id;
  await validate({
    name, description, priority, projectId,
  });
  await taskService.create({
    userId,
    projectId,
    name,
    description,
    priority,
  });
  res.status(201).send();
};

module.exports = create;
