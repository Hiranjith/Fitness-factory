const { body, param, query } = require('express-validator');

exports.createPlanValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Plan name is required')
    .isLength({ max: 50 })
    .withMessage('Plan name cannot exceed 50 characters'),
  body('duration_months')
    .notEmpty()
    .withMessage('Duration in months is required')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 month'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
];

exports.updatePlanValidator = [
  param('id').isUUID().withMessage('Invalid Plan ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Plan name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Plan name cannot exceed 50 characters'),
  body('duration_months')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 month'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean value'),
];

exports.idParamValidator = [
  param('id').isUUID().withMessage('Invalid ID format')
];

exports.listPlansValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('is_active').optional().isBoolean().withMessage('is_active must be a boolean value'),
];
