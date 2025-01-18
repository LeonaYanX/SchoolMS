const { body } = require('express-validator');

const createGroupRules = [
    body('name').isString().isLength({ min: 3, max: 10 }).withMessage('Name must be between 3 and 10 characters'),
    body('students').isMongoId().withMessage('Student must exist')
    .notEmpty().withMessage('students are required'),
    body('teachers').isMongoId().withMessage('Teacher must exist')
    .notEmpty().withMessage('Teacher is required')
    
];

module.exports = { createGroupRules };
