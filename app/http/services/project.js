const { transaction } = require('objection');

const { abort } = require('../../helpers/error');
const { Project, Project_Member: ProjectMember } = require('../../models');

exports.create = async ({
  userId,
  name,
  description,
}) => {
  try {
    await transaction(Project, ProjectMember, async (ProjectTransaction, ProjectMemberTransaction) => {
      const project = await ProjectTransaction.query().insert({
        created_by: userId,
        name,
        description,
        isDelete: false,
      });

      await ProjectMemberTransaction.query().insert({
        member_id: userId,
        project_id: project.id,
      });
    });
  } catch (e) {
    abort('Params Error');
  }
};

exports.update = async ({
  userId,
  projectId,
  name,
  description,
}) => {
  const project = await Project.query()
    .findOne({
      id: projectId,
      isDelete: false,
    });

  if (!project) abort(400, 'Project is not already exists');
  if (project.created_by !== userId) abort(403, 'Access denied');
  await project.$query()
    .update({
      name,
      description,
    });
};

exports.getList = async ({
  userId,
  limit,
  offset,
  sortBy,
  sortType,
}) => {
  const projects = await Project.query()
    .join('projects_members', 'projects.id', 'projects_members.project_id')
    .where({
      'projects_members.member_id': userId,
    })
    .where({
      created_by: userId,
      isDelete: false,
    })
    .select('projects.id', 'projects.name', 'projects.description', 'projects.created_at')
    .offset(offset)
    .limit(limit)
    .orderBy(sortBy, sortType);

  const [{ 'count(`id`)': total }] = await Project.query()
    .join('projects_members', 'projects.id', 'projects_members.project_id')
    .where({
      'projects_members.member_id': userId,
    })
    .where({
      created_by: userId,
      isDelete: false,
    })
    .count('id');

  return {
    projects, total, limit, offset,
  };
};

exports.remove = async ({ userId, projectId }) => {
  const project = await Project.query()
    .findOne({
      id: projectId,
      created_by: userId,
      isDelete: false,
    });

  if (!project) abort(400, 'Project is not already exists');
  if (project.created_by !== userId) abort(403, 'Access denied');

  await project.$query()
    .update({
      isDelete: true,
    });
};
