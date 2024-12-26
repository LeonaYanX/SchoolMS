const Schedule = require('../models/schedule');
const Group = require('../models/group');
const User = require('../models/user');

// 8. Создать расписание
exports.createSchedule = async (req, res) => {
    try {
        const { date, groupId, subject, teacherId } = req.body;

        // Проверяем существование группы и учителя
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ error: 'Group not found' });

        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(400).json({ error: 'Invalid teacher' });
        }

        const schedule = new Schedule({
            date,
            group: groupId,
            subject,
            teacher: teacherId,
        });

        await schedule.save();
        res.status(201).json({ message: 'Schedule created successfully', schedule });
    } catch (error) {
        res.status(400).json({ error: 'Failed to create schedule', details: error.message });
    }
};

// 9. Редактировать расписание
exports.editSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSchedule = await Schedule.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: 'Schedule updated successfully', updatedSchedule });
    } catch (error) {
        res.status(400).json({ error: 'Failed to edit schedule', details: error.message });
    }
};

// 10. Заверить расписание
exports.approveSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await Schedule.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        res.json({ message: 'Schedule approved successfully', schedule });
    } catch (error) {
        res.status(400).json({ error: 'Failed to approve schedule', details: error.message });
    }
};
