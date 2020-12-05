exports.up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('email', 127).collate('latin1_general_ci');
    table.string('password', 127).collate('latin1_general_ci');
    table.string('full_name', 127).collate('utf8_general_ci');
    table.text('avatar').collate('latin1_general_ci');
    table.string('address', 127).collate('utf8_general_ci');
    table.string('phone', 127).collate('latin1_general_ci');
    table.datetime('birthday');

    table.timestamps(true, true);

    table.unique(['email'], 'email');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('users');
};
