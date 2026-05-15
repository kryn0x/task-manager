const { Task, User, Project } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/tasks
 * Admin: get all tasks | Member: get only assigned tasks
 */
const getTasks = async (req, res, next) => {
  try {
    const where = {};

    // Members can only see their own tasks
    if (req.user.role === 'member') {
      where.assigned_to = req.user.id;
    }

    // Optional filters via query params
    if (req.query.status) where.status = req.query.status;
    if (req.query.priority) where.priority = req.query.priority;
    if (req.query.project_id) where.project_id = req.query.project_id;

    const tasks = await Task.findAll({
      where,
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/:id
 * Get a single task
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'title'] },
      ],
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Members can only view their own tasks
    if (req.user.role === 'member' && task.assigned_to !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Not your task.' });
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tasks
 * Create a new task (admin only)
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, due_date, assigned_to, project_id } = req.body;

    // Verify project exists
    const project = await Project.findByPk(project_id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify assignee exists if provided
    if (assigned_to) {
      const assignee = await User.findByPk(assigned_to);
      if (!assignee) {
        return res.status(404).json({ message: 'Assigned user not found' });
      }
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'Pending',
      priority: priority || 'Medium',
      due_date: due_date || null,
      assigned_to: assigned_to || null,
      project_id,
    });

    const fullTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'title'] },
      ],
    });

    res.status(201).json({ message: 'Task created successfully', task: fullTask });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tasks/:id
 * Update a task (admin only)
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, status, priority, due_date, assigned_to, project_id } = req.body;

    // Verify project if changing
    if (project_id && project_id !== task.project_id) {
      const project = await Project.findByPk(project_id);
      if (!project) return res.status(404).json({ message: 'Project not found' });
    }

    // Verify assignee if changing
    if (assigned_to && assigned_to !== task.assigned_to) {
      const assignee = await User.findByPk(assigned_to);
      if (!assignee) return res.status(404).json({ message: 'Assigned user not found' });
    }

    await task.update({
      title: title ?? task.title,
      description: description ?? task.description,
      status: status ?? task.status,
      priority: priority ?? task.priority,
      due_date: due_date !== undefined ? due_date : task.due_date,
      assigned_to: assigned_to !== undefined ? assigned_to : task.assigned_to,
      project_id: project_id ?? task.project_id,
    });

    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'title'] },
      ],
    });

    res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete a task (admin only)
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tasks/:id/status
 * Update task status (members can update their own tasks)
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Members can only update their own tasks
    if (req.user.role === 'member' && task.assigned_to !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Not your task.' });
    }

    const { status } = req.body;
    await task.update({ status });

    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'title'] },
      ],
    });

    res.json({ message: 'Task status updated', task: updatedTask });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus };
