const { body } = require('express-validator');

// Array of subjects
const validSubjects = ['Math', 'Science', 'History', 'English', 'Physics', 'Chemistry'];

const createSheduleRules = [
    body('date')
        .notEmpty().withMessage('date required')
        .isISO8601().withMessage('date required')
        .custom((value) => {
            if (new Date(value) < new Date()) {
                throw new Error('Date is not availible');
            }
            return true;
        }),
    body('group')
        .notEmpty().withMessage('group is required')
        .isMongoId().withMessage('group must exist'),
    body('subject')
        .notEmpty().withMessage('subject is required')
        .isIn(validSubjects).withMessage(`This kind of subject does not exist.Available Subjects: ${validSubjects.join(', ')}`),
    body('teacher')
        .notEmpty().withMessage('teacher is required')
        .isMongoId().withMessage('teacher must exist'),
    body('isApproved')
        .optional()
        .isBoolean().withMessage('isApproved must be true or false ')
];

module.exports = { createSheduleRules };