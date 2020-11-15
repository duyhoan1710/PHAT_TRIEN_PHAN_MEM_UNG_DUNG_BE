const Joi = require('joi');

const projectService = require('../../services/project');
const { abort } = require('../../../helpers/error');

const validate = async ({ name, description }) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow(''),
    });
    return await schema.validate({ name, description });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const create = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;
  await validate({ name, description });
  await projectService.create({
    userId,
    name,
    description,
  });
  res.status(201).send();
};

module.exports = create;
