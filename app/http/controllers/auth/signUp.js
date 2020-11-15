const Joi = require('joi');

const auth = require('../../services/auth');
const { abort } = require('../../../helpers/error');

const validate = async (params) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string().min(6),
      passwordConfirmation: Joi.equal(Joi.ref('password')),
      fullName: Joi.string().required(),
    });

    return await schema.validate(params);
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const signUp = async (req, res) => {
  const params = {
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
    fullName: req.body.fullName,
  };
  await validate(params);
  await auth.signUp(params);
  return res.status(201).send();
};

module.exports = signUp;
