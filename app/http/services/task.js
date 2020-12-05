const { abort } = require('../../helpers/error');
const { Task, Project_Member: ProjectMember } = require('../../models');
const taskStatus = require('../../enums/taskStatus');

exports.create = async ({
  userId,
  projectId,
  name,
  description,
  priority,
  distribute,
  assignId,
}) => {
  let member = await ProjectMember.query()
    .join('projects', 'projects_members.project_id', 'projects.id')
    .findOne({
      project_id: projectId,
      member_id: userId,
      'projects.isDelete': false,
    });

  if (!member) abort(403, 'Access denied');

  if (assignId) {
    member = await ProjectMember.query()
      .join('projects', 'projects_members.project_id', 'projects.id')
      .findOne({
        project_id: projectId,
        member_id: assignId,
        'projects.isDelete': false,
      });

    if (!member) abort(400, 'Assign is not exists');
  }

  await Task.query().insert({
    project_id: projectId,
    created_by: userId,
    updated_by: userId,
    assignId: assignId || null,
    name,
    description,
    distribute,
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
  assignId,
}) => {
  let member = await ProjectMember.query()
    .join('projects', 'projects_members.project_id', 'projects.id')
    .findOne({
      project_id: projectId,
      member_id: userId,
      'projects.isDelete': false,
    });

  if (!member) abort(403, 'Access denied');

  if (assignId) {
    member = await ProjectMember.query()
      .join('projects', 'projects_members.project_id', 'projects.id')
      .findOne({
        project_id: projectId,
        member_id: assignId,
        'projects.isDelete': false,
      });

    if (!member) abort(400, 'Assign is not exists');
  }

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
      updated_by: userId,
      assignId: assignId || null,
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
    .leftJoin('users as created', 'tasks.created_by', 'created.id')
    .leftJoin('users as updated', 'tasks.updated_by', 'updated.id')
    .leftJoin('users as assign', 'tasks.assignId', 'assign.id')
    .where({ project_id: projectId, status })
    .select(
      'tasks.id',
      'tasks.name',
      'tasks.description',
      'tasks.status',
      'tasks.priority',
      'tasks.distribute',
      'tasks.created_at',
      'created.id AS created_id',
      'created.full_name AS created_name',
      'created.email AS created_email ',
      'created.avatar AS created_avatar ',
      'updated.id AS updated_id',
      'updated.full_name AS updated_name',
      'updated.email AS updated_email',
      'updated.avatar AS updated_avatar',
      'assign.id AS assign_id',
      'assign.full_name AS assign_name',
      'assign.email AS assign_email',
      'assign.avatar AS assign_avatar',
    )
    .offset(offset)
    .limit(limit)
    .orderBy('tasks.id', 'DESC');

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
