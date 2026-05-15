const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require('../controllers/taskController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { taskValidators, statusUpdateValidators } = require('../validators/taskValidators');
const validate = require('../middleware/validate');

// All task routes require authentication
router.use(authenticate);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', requireAdmin, taskValidators, validate, createTask);
router.put('/:id', requireAdmin, taskValidators, validate, updateTask);
router.delete('/:id', requireAdmin, deleteTask);
router.patch('/:id/status', statusUpdateValidators, validate, updateTaskStatus);

module.exports = router;
