const Joi = require('joi');

const userService = require('../../services/user');
const { abort } = require('../../../helpers/error');

const validate = async ({
  limit, offset, sortBy, sortType, keySearch,
}) => {
  try {
    const schema = Joi.object({
      limit: Joi.number().min(1).required(),
      offset: Joi.number().min(0).required(),
      sortBy: Joi.string().valid([
        'id', 'full_name', 'email',
      ]).required(),
      sortType: Joi.string().valid([
        'asc', 'desc',
      ]).required(),
      keySearch: Joi.string().allow(''),
    });
    return await schema.validate({
      limit, offset, sortBy, sortType, keySearch,
    });
  } catch (error) {
    return abort(400, 'Params Error');
  }
};

const getList = async (req, res) => {
  const {
    sortBy, sortType, limit, offset, keySearch,
  } = req.query;
  await validate({
    sortBy, sortType, limit, offset, keySearch,
  });
  const tasks = await userService.getList({
    limit,
    offset,
    sortBy,
    sortType,
    keySearch,
  });
  res.status(200).send(tasks);
};

module.exports = getList;
