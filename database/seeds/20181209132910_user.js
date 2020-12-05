const bcrypt = require('bcrypt');
const gravatar = require('gravatar');

const saltRounds = 10;

exports.seed = async (knex) => {
  await knex('users').del();
  await knex('users').insert([{
    email: 'hoanduy1710@gmail.com',
    password: await bcrypt.hash('123456', saltRounds),
    full_name: 'Peter Pan',
    avatar: gravatar.url('hoanduy1710@gmail.com', { s: '200', r: 'x', d: 'retro' }, true),
  }]);
};
