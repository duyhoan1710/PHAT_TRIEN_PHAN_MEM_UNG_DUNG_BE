const Joi = require('joi');

const user = require('../../services/user');
const { abort } = require('../../../helpers/error');

const validate = async (params) => {
  try {
    const schema = Joi.object({
      password: Joi.string().min(6),
      passwordConfirmation: Joi.equal(Joi.ref('password')),
      fullName: Joi.string().required(),
    });

    return await schema.validate(params);
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const update = async (req, res) => {
  const params = {
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
    fullName: req.body.fullName,
  };
  const userId = req.user.id;
  await validate(params);
  await user.update({ ...params, userId });
  return res.status(204).send();
};

module.exports = update;
