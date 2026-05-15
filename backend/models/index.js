const sequelize = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');

// ─── Associations ────────────────────────────────────────────────────────────

// User → Projects (creator)
User.hasMany(Project, { foreignKey: 'created_by', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Project → Tasks
Project.hasMany(Task, { foreignKey: 'project_id', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

// User → Tasks (assignee)
User.hasMany(Task, { foreignKey: 'assigned_to', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

module.exports = { sequelize, User, Project, Task };
