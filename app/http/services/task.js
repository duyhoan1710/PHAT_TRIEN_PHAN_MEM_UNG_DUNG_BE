const { abort } = require('../../helpers/error');
const { Task, Project_Member: ProjectMember } = require('../../models');
const taskStatus = require('../../enums/taskStatus');

exports.create = async ({
  userId,
  projectId,
  name,
  description,
  priority,
}) => {
  const member = await ProjectMember.query()
    .join('projects', 'projects_members.project_id', 'projects.id')
    .findOne({
      project_id: projectId,
      member_id: userId,
      'projects.isDelete': false,
    });

  if (!member) abort(403, 'Access denied');

  await Task.query().insert({
    project_id: projectId,
    name,
    description,
    status: taskStatus.PENDING,
    priority,
  });
};

exports.update = async ({
  userId,
  projectId,
  taskId,
  name,
  description,
  status,
  priority,
}) => {
  const member = await ProjectMember.query()
    .join('projects', 'projects_members.project_id', 'projects.id')
    .findOne({
      project_id: projectId,
      member_id: userId,
      'projects.isDelete': false,
    });

  if (!member) abort(403, 'Access denied');

  const task = await Task.query()
    .findOne({
      id: taskId,
    });

  if (!task) abort(400, 'Task is not already exists');
  if (task.project_id !== Number(projectId)) abort(403, 'Access denied');

  await task.$query()
    .update({
      name,
      description,
      status,
      priority,
    });
};

exports.getList = async ({
  userId,
  projectId,
  status,
  limit,
  offset,
}) => {
  const member = await ProjectMember.query()
    .join('projects', 'projects_members.project_id', 'projects.id')
    .findOne({
      project_id: projectId,
      member_id: userId,
      'projects.isDelete': false,
    });

  if (!member) abort(403, 'Access denied');

  const tasks = await Task.query()
    .where({ project_id: projectId, status })
    .select('id', 'name', 'description', 'status', 'priority')
    .offset(offset)
    .limit(limit)
    .orderBy('id', 'DESC');

  return tasks;
};

exports.remove = async ({ userId, projectId, taskId }) => {
  const member = await ProjectMember.query()
    .join('projects', 'projects_members.project_id', 'projects.id')
    .findOne({
      project_id: projectId,
      member_id: userId,
      'projects.isDelete': false,
    });

  if (!member) abort(403, 'Access denied');

  const task = await Task.query()
    .findOne({
      id: taskId,
    });

  if (!task) abort(400, 'Task is not already exists');
  if (task.project_id !== Number(projectId)) abort(403, 'Access denied');

  await Task.query().deleteById(taskId);
};
