const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    name: { type: String, default: null }, // Название чата (например, для группы)
    isGroup: { type: Boolean, default: false }, // Индивидуальный или групповой чат
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Участники чата
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Отправитель
            content: { type: String, required: true }, // Текст сообщения
            timestamp: { type: Date, default: Date.now }, // Время отправки
        }
    ],
    createdAt: { type: Date, default: Date.now }, // Дата создания чата
});

module.exports = mongoose.model('Chat', chatSchema);
