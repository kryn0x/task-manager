const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { projectValidators } = require('../validators/projectValidators');
const validate = require('../middleware/validate');

// All project routes require authentication
router.use(authenticate);

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', requireAdmin, projectValidators, validate, createProject);
router.put('/:id', requireAdmin, projectValidators, validate, updateProject);
router.delete('/:id', requireAdmin, deleteProject);

module.exports = router;
