const bcrypt = require('bcrypt');

const { User } = require('../../models');

exports.update = async ({ userId, fullName, password }) => {
  let hashPassword;
  const params = { full_name: fullName };
  if (password) {
    const salt = parseInt(process.env.SALT_ROUNDS, 10);
    hashPassword = await bcrypt.hash(password, salt);
    params.password = hashPassword;
  }
  await User.query()
    .findById(userId)
    .update(params);
};
