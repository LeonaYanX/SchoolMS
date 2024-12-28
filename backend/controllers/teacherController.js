const Assignment = require('../models/assignment');
const User = require('../models/user');
const Group = require('../models/group');

exports.getUploadedFile = async (req, res) => {
    const teacherId = req.params.teacherId; // Учитель ID из параметров запроса

    try {
        // Находим задания, где учитель указан как `teacher`
        const assignments = await Assignment.find({ teacher: teacherId });

        // Если задания отсутствуют
        if (assignments.length < 1) {
            return res.status(200).json({ message: 'There are no tasks at this moment.' });
        }

        // Извлекаем все submissions из всех заданий
        const submissions = assignments
            .map(assignment => assignment.submissions) // Получаем массив `submissions` из каждого задания
            .flat();                                   // "Сплющиваем" в единый массив

        // Если сабмишнов нет
        if (submissions.length < 1) {
            return res.status(200).json({ message: 'There are no submissions yet.' });
        }

        // Возвращаем сабмишны
        res.status(200).json(submissions);
    } catch (error) {
        console.error('Error getting uploaded files:', error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
};
