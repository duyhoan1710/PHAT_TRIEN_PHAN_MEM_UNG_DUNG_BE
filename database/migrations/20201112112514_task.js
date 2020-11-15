exports.up = async (knex) => {
  await knex.schema.createTable('tasks', (table) => {
    table.increments('id');
    table.string('name', 127).collate('utf8_general_ci');
    table.string('description', 127).collate('utf8_general_ci');
    table.tinyint('status');
    table.tinyint('priority');
    table.integer('project_id').unsigned().references('projects.id');

    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('tasks');
};
