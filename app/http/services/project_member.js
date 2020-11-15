const { abort } = require('../../helpers/error');
const { Project, Project_Member: ProjectMember } = require('../../models');

exports.addMember = async ({
  userId,
  memberId,
  projectId,
}) => {
  const project = await Project.query()
    .findOne({
      id: projectId,
      isDelete: false,
    });

  if (!project) abort(400, 'Project is not already exists');
  else if (project.created_by !== userId) abort(403, 'access denied');

  await ProjectMember.query().insert({
    member_id: memberId,
    project_id: projectId,
  });
};

exports.getListProject = async ({
  userId,
  limit,
  offset,
}) => {
  const projects = await ProjectMember.query()
    .join('projects', 'projects_members.project_id', 'projects.id')
    .where({
      member_id: userId,
      'projects.isDelete': false,
    })
    .select('projects.id', 'projects.name', 'projects.description', 'projects.created_at')
    .offset(offset)
    .limit(limit);

  return { projects };
};

exports.getListMember = async ({
  userId,
  projectId,
  limit,
  offset,
}) => {
  const project = await ProjectMember.query()
    .join('projects', 'projects_members.project_id', 'projects.id')
    .findOne({
      member_id: userId,
      project_id: projectId,
      'projects.isDelete': false,
    });

  if (!project) abort(403, 'access denied');

  const members = await ProjectMember.query()
    .join('users', 'projects_members.member_id', 'users.id')
    .where({
      project_id: projectId,
    })
    .select('users.id', 'users.full_name')
    .offset(offset)
    .limit(limit);

  return { members };
};

exports.removeMember = async ({ userId, memberId, projectId }) => {
  const project = await Project.query()
    .findOne({
      id: projectId,
      isDelete: false,
    });

  if (!project) abort(400, 'Project is not already exists');
  if (project.created_by !== userId) abort(403, 'Access denied');

  await ProjectMember.query()
    .delete()
    .where({
      member_id: memberId,
      project_id: projectId,
    });
};
