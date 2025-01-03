const { body } = require('express-validator');

const createAssignmentRules = [
    body('title').isString().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('description').isString().isLength({ min: 10 }).withMessage('Description is too short'),
    body('deadline').isISO8601().withMessage('Deadline must be a valid date'),
    body('groupId').isString().withMessage('Group ID must be a valid string'),
];

module.exports = { createAssignmentRules };
