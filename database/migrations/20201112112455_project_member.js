exports.up = async (knex) => {
  await knex.schema.createTable('projects_members', (table) => {
    table.integer('project_id').unsigned().references('projects.id');
    table.integer('member_id').unsigned().references('users.id');

    table.primary(['project_id', 'member_id']);
    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('projects_members');
};
