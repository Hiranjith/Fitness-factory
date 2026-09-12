const { body, param, query } = require('express-validator');

exports.createMemberValidator = [
  body('serial_no')
    .notEmpty()
    .withMessage('Serial number is required')
    .isInt()
    .withMessage('Serial number must be an integer'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Member name is required')
    .isLength({ max: 150 })
    .withMessage('Name cannot exceed 150 characters'),
  body('mobile_number')
    .trim()
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^\d{10}$/)
    .withMessage('Mobile number must contain exactly 10 digits'),
  body('address').optional().trim(),
  body('plan_id')
    .notEmpty()
    .withMessage('Plan ID is required for initial membership')
    .isUUID()
    .withMessage('Invalid Plan ID format'),
];

exports.updateMemberValidator = [
  param('id').isUUID().withMessage('Invalid Member ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Member name cannot be empty')
    .isLength({ max: 150 })
    .withMessage('Name cannot exceed 150 characters'),
  body('mobile_number')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Mobile number cannot be empty')
    .matches(/^\d{10}$/)
    .withMessage('Mobile number must contain exactly 10 digits'),
  body('address').optional().trim(),
  body('status')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Status cannot be empty'),
];

exports.idParamValidator = [
  param('id').isUUID().withMessage('Invalid ID format')
];

exports.listMembersValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('status').optional().trim(),
];
