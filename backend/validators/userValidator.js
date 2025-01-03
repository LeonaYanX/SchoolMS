const { body } = require('express-validator');

const createUserRules = [
    body('firstName')
        .isString()
        .withMessage('First name must be a string')
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters'),
    body('lastName')
        .isString()
        .withMessage('Last name must be a string')
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters'),
    body('email')
        .isEmail()
        .withMessage('Invalid email format')
        .notEmpty()
        .withMessage('Email is required'),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter'),
    body('role')
        .isIn(['admin', 'teacher', 'student'])
        .withMessage('Role must be one of: admin, teacher, student'),
];

module.exports = { createUserRules };
