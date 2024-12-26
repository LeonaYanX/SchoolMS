const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const { createUser, deleteUser, getAllUsers, updateUser, approveUser, blockUser, getUserStatistics, createGroup, addStudentsToGroup, addTeachersToGroup, notApprovedUserList } = require('../controllers/adminController');
const { createSchedule, editSchedule, approveSchedule } = require('../controllers/scheduleController');
const checkAdmin = require('../middlewares/checkAdmin');

const router = express.Router();

// Middleware
router.use(verifyToken);
router.use(checkAdmin);

// Пользователи
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.get('/users/notapproved', notApprovedUserList );
router.patch('/users/:id/approve', approveUser);  // посмотреть что такое патч
router.patch('/users/:id/block', blockUser);

// Статистика
router.get('/statistics', getUserStatistics);

// Группы
router.post('/groups', createGroup);
router.patch('/groups/:id/students', addStudentsToGroup);
router.patch('/groups/:id/teachers', addTeachersToGroup);

// Расписание
router.post('/schedules', createSchedule);
router.put('/schedules/:id', editSchedule);
router.patch('/schedules/:id/approve', approveSchedule);

module.exports = router;