const Joi = require('joi');

const projectService = require('../../services/project');
const { abort } = require('../../../helpers/error');

const validate = async ({ projectId }) => {
  try {
    const schema = Joi.object({
      projectId: Joi.number().min(1).required(),
    });
    return await schema.validate({ projectId });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const remove = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  await validate({ projectId });
  await projectService.remove({
    projectId,
    userId,
  });
  res.status(204).send();
};

module.exports = remove;
