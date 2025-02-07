const express = require('express');
const { verifyToken ,refreshToken} = require('../middlewares/authMiddleware');
//const { createUser, deleteUser, getAllUsers, updateUser,
 //    approveUser, blockUser, getUserStatistics, createGroup,
 //     addStudentsToGroup, addTeachersToGroup, notApprovedUserList , 
 //     createSchedule, editSchedule, approveSchedule } = require('../controllers/adminController');
 const adminController = require('../controllers/admin_controller');
const roleMiddleware = require('../middlewares/roleMiddleware');
const userValidator = require('../validators/userValidator');
const scheduleValidator = require('../validators/sheduleValidator');
const groupValidator = require('../validators/groupValidator');
const validate = require('../middlewares/validators');
const router = express.Router();

// Middleware
router.use(verifyToken, refreshToken);
router.use(roleMiddleware('admin'));

// Users
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Admin creates a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/users', adminController.createUser);

router.post('/users',userValidator.createUserRules, validate.validate , adminController.createUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id',userValidator.createUserRules,validate.validate, adminController.updateUser );
router.get('/users/notapproved', adminController.notApprovedUserList );
router.patch('/users/:id/approve', adminController.approveUser);  // посмотреть что такое патч
router.patch('/users/:id/block', adminController.blockUser);

// Statistics
router.get('/statistics', adminController.getUserStatistics);

// Groups
router.post('/groups',groupValidator.createGroupRules , validate.validate, adminController.createGroup);
router.patch('/groups/:id/students', adminController.addStudentsToGroup);
router.patch('/groups/:id/teachers', adminController.addTeachersToGroup);

// Schedule
router.post('/schedules', scheduleValidator.createSheduleRules , validate.validate,  adminController.createSchedule); 
router.put('/schedules/:id', scheduleValidator.createSheduleRules , validate.validate , adminController.editSchedule);
router.patch('/schedules/:id/approve',adminController.approveSchedule);

module.exports = router;
