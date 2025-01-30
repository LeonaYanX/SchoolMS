const express = require('express');
const { verifyToken ,refreshToken} = require('../middlewares/authMiddleware');
const { createUser, deleteUser, getAllUsers, updateUser, approveUser, blockUser, getUserStatistics, createGroup, addStudentsToGroup, addTeachersToGroup, notApprovedUserList } = require('../controllers/adminController');
const { createSchedule, editSchedule, approveSchedule } = require('../controllers/scheduleController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { createUserRules } = require('../validators/userValidator');
const {createScheduleRules} = require('../validators/sheduleValidator');
const {createGroupRules} = require('../validators/groupValidator');
const validate = require('../middlewares/validators');
const router = express.Router();

// Middleware
router.use(verifyToken, refreshToken);
router.use(roleMiddleware('admin'));

// Users
router.post('/users', createUser,createUserRules, validate);
router.delete('/users/:id', deleteUser);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser,createUserRules, validate);
router.get('/users/notapproved', notApprovedUserList );
router.patch('/users/:id/approve', approveUser);  // посмотреть что такое патч
router.patch('/users/:id/block', blockUser);

// Statistics
router.get('/statistics', getUserStatistics);

// Groups
router.post('/groups', createGroup , createGroupRules , validate );
router.patch('/groups/:id/students', addStudentsToGroup);
router.patch('/groups/:id/teachers', addTeachersToGroup);

// Schedule
router.post('/schedules', createSchedule , createScheduleRules , validate); 
router.put('/schedules/:id', editSchedule , createScheduleRules , validate);
router.patch('/schedules/:id/approve', approveSchedule);

module.exports = router;
