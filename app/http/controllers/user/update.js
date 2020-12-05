const Joi = require('joi');

const user = require('../../services/user');
const { abort } = require('../../../helpers/error');

const validate = async (params) => {
  const pattern = /^(09|01[2|6|8|9])+([0-9]{8})\b$/;
  try {
    const schema = Joi.object({
      fullName: Joi.string().required(),
      phone: Joi.string().regex(pattern).allow(''),
      address: Joi.string().allow(''),
      birthday: Joi.date().allow(''),
    });

    return await schema.validate(params);
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const update = async (req, res) => {
  const params = {
    fullName: req.body.fullName,
    address: req.body.address,
    birthday: req.body.birthday,
    phone: req.body.phone,
  };
  const userId = req.user.id;
  await validate(params);
  await user.update({ ...params, userId });
  return res.status(204).send();
};

module.exports = update;
