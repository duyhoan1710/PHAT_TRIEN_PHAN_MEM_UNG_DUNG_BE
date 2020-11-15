const Joi = require('joi');

const projectService = require('../../services/project');
const { abort } = require('../../../helpers/error');
const taskStatus = require('../../../enums/taskStatus');

const validate = async ({
  projectId, name, description, status,
}) => {
  try {
    const schema = Joi.object({
      projectId: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().allow(''),
      status: Joi
        .valid(
          taskStatus.getValues(),
        ),
    });
    return await schema.validate({
      projectId, name, description, status,
    });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const update = async (req, res) => {
  const { name, description } = req.body;
  const { projectId } = req.params;
  const userId = req.user.id;

  await validate({
    projectId, name, description,
  });
  await projectService.update({
    projectId,
    userId,
    name,
    description,
  });
  res.status(204).send();
};

module.exports = update;
