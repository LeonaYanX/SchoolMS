const Chat = require('../models/chat');
const User = require('../models/user');

// Создать чат (групповой или индивидуальный)
exports.createChat = async (req, res) => {
    try {
        const { participantIds, isGroup, name } = req.body;

        // Проверить, есть ли участники
        if (!participantIds || participantIds.length < 2) {
            return res.status(400).json({ message: 'Необходимо указать как минимум двух участников.' });
        }

        const chat = new Chat({
            name: isGroup ? name : null,
            isGroup,
            participants: participantIds,
        });

        await chat.save();

        res.status(201).json({ message: 'Чат создан успешно.', chat });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании чата.', error });
    }
};

// Получить список чатов пользователя
exports.getUserChats = async (req, res) => {
    try {
        const chats = await Chat.find({ participants: req.user._id })
            .populate('participants', 'firstName lastName role')
            .sort({ updatedAt: -1 }); // Последние чаты наверху

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении чатов.', error });
    }
};

// Получить сообщения конкретного чата
exports.getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await Chat.findById(chatId)
            .populate('messages.sender', 'firstName lastName role') // Информация об отправителе
            .populate('participants', 'firstName lastName role'); // Информация об участниках

        if (!chat) return res.status(404).json({ message: 'Чат не найден.' });

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении сообщений.', error });
    }
};

// Отправить сообщение в чат
exports.sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { content } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: 'Чат не найден.' });

        // Добавить сообщение в чат
        chat.messages.push({
            sender: req.user._id,
            content,
        });

        await chat.save();
        res.status(200).json({ message: 'Сообщение отправлено.', chat });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при отправке сообщения.', error });
    }
};

// Добавить участников в чат
exports.addParticipants = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { participantIds } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: 'Чат не найден.' });

        // Добавить новых участников, избегая дублирования
        chat.participants = Array.from(new Set([...chat.participants, ...participantIds]));

        await chat.save();
        res.status(200).json({ message: 'Участники добавлены.', chat });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при добавлении участников.', error });
    }
};
