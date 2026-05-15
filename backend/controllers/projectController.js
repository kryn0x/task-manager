const { Project, User, Task } = require('../models');

/**
 * GET /api/projects
 * Get all projects (admin sees all, member sees projects with their tasks)
 */
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        {
          model: Task,
          as: 'tasks',
          attributes: ['id', 'status'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Add task count summary to each project
    const projectsWithStats = projects.map((p) => {
      const proj = p.toJSON();
      proj.taskCount = proj.tasks.length;
      proj.completedCount = proj.tasks.filter((t) => t.status === 'Completed').length;
      return proj;
    });

    res.json({ projects: projectsWithStats });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/:id
 * Get a single project with its tasks
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        {
          model: Task,
          as: 'tasks',
          include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/projects
 * Create a new project (admin only)
 */
const createProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      created_by: req.user.id,
    });

    // Fetch with associations
    const fullProject = await Project.findByPk(project.id, {
      include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }],
    });

    res.status(201).json({ message: 'Project created successfully', project: fullProject });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/projects/:id
 * Update a project (admin only)
 */
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { title, description } = req.body;
    await project.update({ title, description });

    const updatedProject = await Project.findByPk(project.id, {
      include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }],
    });

    res.json({ message: 'Project updated successfully', project: updatedProject });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/projects/:id
 * Delete a project and its tasks (admin only)
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.destroy(); // Tasks cascade deleted via model association

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };
