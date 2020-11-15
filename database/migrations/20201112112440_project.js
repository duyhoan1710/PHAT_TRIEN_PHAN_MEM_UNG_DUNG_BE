exports.up = async (knex) => {
  await knex.schema.createTable('projects', (table) => {
    table.increments('id');
    table.string('name', 127).collate('utf8_general_ci');
    table.string('description', 127).collate('utf8_general_ci');
    table.boolean('isDelete');
    table.integer('created_by').unsigned().references('users.id');

    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('projects');
};
