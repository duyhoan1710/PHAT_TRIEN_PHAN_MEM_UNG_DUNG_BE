function me(req, res) {
  const responseData = {
    id: req.user.id,
    full_name: req.user.full_name,
    email: req.user.email,
    avatar: req.user.avatar,
    address: req.user.address,
    phone: req.user.phone,
    birthday: req.user.birthday,
  };

  return res.status(200).send(responseData);
}

module.exports = me;
