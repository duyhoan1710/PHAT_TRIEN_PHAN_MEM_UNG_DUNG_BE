const { transaction } = require('objection');

const { abort } = require('../../helpers/error');
const { Project, Project_Member: ProjectMember } = require('../../models');

exports.addMember = async ({
  userId,
  membersId,
  projectId,
}) => {
  const project = await Project.query()
    .findOne({
      id: projectId,
      isDelete: false,
    });

  if (!project) abort(400, 'Project is not already exists');
  else if (project.created_by !== userId) abort(403, 'access denied');

  const members = membersId.map((memberId) => ({ member_id: memberId, project_id: projectId }));
  try {
    await transaction(ProjectMember, async (ProjectMemberTrx) => {
      await ProjectMemberTrx.knexQuery().insert(members);
    });
  } catch (e) {
    abort(400, 'One of users can not add to or is already exist in this project');
  }
};

exports.getListProject = async ({
  userId,
  limit,
  offset,
  sortBy,
  sortType,
}) => {
  const projects = await ProjectMember.query()
    .join('projects', 'projects_members.project_id', 'projects.id')
    .join('users', 'projects_members.member_id', 'users.id')
    .where({
      member_id: userId,
      'projects.isDelete': false,
    })
    .select(
      'projects.id',
      'projects.name',
      'projects.description',
      'projects.created_at',
      'users.full_name',
    )
    .offset(offset)
    .limit(limit)
    .orderBy(sortBy, sortType);

  const [{ 'count(`project_id`)': total }] = await ProjectMember.query()
    .join('projects', 'projects_members.project_id', 'projects.id')
    .where({
      member_id: userId,
      'projects.isDelete': false,
    }).count('project_id');

  return {
    projects, total, limit, offset,
  };
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
    .select('users.id', 'users.full_name', 'users.email', 'users.avatar', 'users.phone', 'users.address', 'users.birthday')
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
