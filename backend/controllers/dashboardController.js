const { User, Project, Task } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/dashboard/admin
 * Admin dashboard analytics
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parallel queries for performance
    const [
      totalUsers,
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      recentTasks,
    ] = await Promise.all([
      User.count(),
      Project.count(),
      Task.count(),
      Task.count({ where: { status: 'Completed' } }),
      Task.count({ where: { status: 'Pending' } }),
      Task.count({ where: { status: 'In Progress' } }),
      Task.count({
        where: {
          due_date: { [Op.lt]: today },
          status: { [Op.ne]: 'Completed' },
        },
      }),
      Task.findAll({
        limit: 8,
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'assignee', attributes: ['id', 'name'] },
          { model: Project, as: 'project', attributes: ['id', 'title'] },
        ],
      }),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
      },
      recentTasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/member
 * Member dashboard analytics (only their tasks)
 */
const getMemberDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalAssigned,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      recentTasks,
    ] = await Promise.all([
      Task.count({ where: { assigned_to: userId } }),
      Task.count({ where: { assigned_to: userId, status: 'Completed' } }),
      Task.count({ where: { assigned_to: userId, status: 'Pending' } }),
      Task.count({ where: { assigned_to: userId, status: 'In Progress' } }),
      Task.count({
        where: {
          assigned_to: userId,
          due_date: { [Op.lt]: today },
          status: { [Op.ne]: 'Completed' },
        },
      }),
      Task.findAll({
        where: { assigned_to: userId },
        limit: 8,
        order: [['createdAt', 'DESC']],
        include: [
          { model: Project, as: 'project', attributes: ['id', 'title'] },
        ],
      }),
    ]);

    res.json({
      stats: {
        totalAssigned,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
      },
      recentTasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminDashboard, getMemberDashboard };
