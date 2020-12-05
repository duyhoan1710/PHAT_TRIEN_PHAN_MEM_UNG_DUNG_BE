const { User } = require('../../models');

exports.update = async ({
  userId, fullName, phone, birthday, address,
}) => {
  await User.query()
    .findById(userId)
    .update({
      full_name: fullName,
      phone,
      birthday: birthday || null,
      address,
    });
};

exports.getList = async ({
  limit, offset, sortBy, sortType, keySearch,
}) => {
  const users = await User.query()
    .where('email', 'LIKE', `%${keySearch}%`)
    .select('id', 'email', 'full_name', 'avatar')
    .offset(offset)
    .limit(limit)
    .orderBy(sortBy, sortType);

  const [{ 'count(`id`)': total }] = await User.query()
    .count('id');

  return {
    users,
    total,
    limit,
    offset,
  };
};
