const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(roleMiddleware('student', 'teacher'));
// Создать чат
router.post('/create', verifyToken, chatController.createChat);

// Получить список чатов пользователя
router.get('/user', verifyToken, chatController.getUserChats);

// Получить сообщения чата
router.get('/:chatId', verifyToken, chatController.getChatMessages);

// Отправить сообщение
router.post('/:chatId/message', verifyToken, chatController.sendMessage);

// Добавить участников
router.put('/:chatId/participants', verifyToken, chatController.addParticipants);

module.exports = router;
