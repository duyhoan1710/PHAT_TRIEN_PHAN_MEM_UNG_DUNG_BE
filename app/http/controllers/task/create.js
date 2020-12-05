const Joi = require('joi');

const taskService = require('../../services/task');
const { abort } = require('../../../helpers/error');
const taskPriority = require('../../../enums/taskPriority');
const taskDistribute = require('../../../enums/taskDistribute');

const validate = async ({
  name, description, priority, projectId, assignId, distribute,
}) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow(''),
      priority: Joi.number()
        .valid(
          taskPriority.getValues(),
        ).required(),
      distribute: Joi.number()
        .valid(
          taskDistribute.getValues(),
        ).required(),
      projectId: Joi.number().required(),
      assignId: Joi.number().allow(null),
    });
    return await schema.validate({
      name, description, priority, projectId, assignId, distribute,
    });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const create = async (req, res) => {
  const {
    name, description, priority, assignId, distribute,
  } = req.body;
  const { projectId } = req.params;
  const userId = req.user.id;
  await validate({
    name, description, priority, projectId, assignId, distribute,
  });

  await taskService.create({
    userId,
    projectId,
    name,
    description,
    priority,
    assignId,
    distribute,
  });
  res.status(201).send();
};

module.exports = create;
