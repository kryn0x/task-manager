const { body } = require('express-validator');

const taskValidators = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Status must be Pending, In Progress, or Completed'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),

  body('due_date')
    .optional({ nullable: true, checkFalsy: true })
    .isDate().withMessage('Due date must be a valid date (YYYY-MM-DD)'),

  body('assigned_to')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('assigned_to must be a valid user ID'),

  body('project_id')
    .notEmpty().withMessage('Project ID is required')
    .isInt({ min: 1 }).withMessage('project_id must be a valid project ID'),
];

const statusUpdateValidators = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Status must be Pending, In Progress, or Completed'),
];

module.exports = { taskValidators, statusUpdateValidators };
