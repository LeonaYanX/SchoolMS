const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');





router.post('/change-password',roleMiddleware('teacher','student'),verifyToken, userController.changePassword);

// Получить все задания для группы
router.get('/assignments',roleMiddleware('student'), verifyToken, userController.getAssignments);

// Отправить выполненное задание todo cloud.js and check
router.post('/assignments/:assignmentId/submit',roleMiddleware('student'), verifyToken, userController.submitAssignment);

module.exports=router;