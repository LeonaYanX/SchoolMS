const {findUserById , blockUser , notApprovedUserList 
    , approveUser , updateUser , getAllUsers 
    , deleteUserById , createNewUser , findUserWithRoleAndList } = require('../utils/userServices');
const {findGroupById , createNewGroup , 
    addTeacherToGroup , addStudentToGroup } = require('../utils/groupServices');
const {approveSchedule , editSchedule , createNewSchedule} = require('../utils/sheduleServices');
//const User = require('../models/user');
//const Group = require('../models/group');
//const Schedule = require('../models/schedule');


// 1. Создать пользователя
exports.createUser = async (req, res, next) => {
    try {
        //const user = new User(req.body);
       // await user.save();
      await createNewUser(req.body);
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        next(error);
    }
};

// 2. Удалить пользователя
exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
       await deleteUserById(id);
       // await User.findByIdAndDelete(id); 
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        //res.status(400).json({ error: 'Failed to delete user', details: error.message });
        next(error);
    }
};

// 3. Получить список пользователей
exports.getAllUsers = async (req, res, next) => {
    try {
       // const users = await User.find();
       const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        next(error);
        //res.status(400).json({ error: 'Failed to fetch users', details: error.message });
    }
};

// 4. Обновить пользователя
exports.updateUser = async (req, res , next) => {
    try {
        const { id } = req.params;
        const updatedUser = await updateUser(id , req.body );
      //  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        //res.status(400).json({ error: 'Failed to update user', details: error.message });
        next(error);
    }
};

// 5. Заверить пользователя
exports.approveUser = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const user = await approveUser(id);
       // const user = await User.findByIdAndUpdate(id, { IsApproved: true }, { new: true });
        res.json({ message: 'User approved successfully', user });
    } catch (error) {
        //res.status(400).json({ error: 'Failed to approve user', details: error.message });
        next(error);
    }
};

//5.1 Увидеть всех незаверенных пользователей
exports.notApprovedUserList = async (req,res,next)=>{
    try{
        const users = await notApprovedUserList();
        //const users= await User.find({IsApproved:false});
        if(users.length===0){
            res.status(404).json({message:'There is no not approved users.'});
        }
        res.json(users);
    }catch(error){
        next(error);
        //res.status(500).json({error:'Failed to see the list', details: error.message});
    }
};

// 6. Заблокировать пользователя
exports.blockUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { duration } = req.body; // 1 час, 1 неделя и т.д. берет из чекбокса в форме
        const expiry = new Date();

        switch (duration) {
            case '1h':
                expiry.setHours(expiry.getHours() + 1);
                break;
            case '1w':
                expiry.setDate(expiry.getDate() + 7);
                break;
            case '1m':
                expiry.setMonth(expiry.getMonth() + 1);
                break;
            case 'forever':// может поменять только в апдейте
                expiry.setFullYear(9999);
                break;
            default:
                return res.status(400).json({ error: 'Invalid duration' });
        }

       // const user = await User.findByIdAndUpdate( id, { IsBlocked: true, blockExpiry: expiry }, { new: true });
       const user = await blockUser(id , expiry);
        res.json({ message: 'User blocked successfully', blockExpiry: expiry, user });
    } catch (error) {
        next(error);
       // res.status(500).json({ error: 'Failed to block user', details: error.message });
    }
};

// 8. Создать расписание
exports.createSchedule = async (req, res, next) => {
    try {
        const { date, groupId, subject, teacherId } = req.body;

        // Проверяем существование группы и учителя
       // const group = await Group.findById(groupId);
       const group = await findGroupById(groupId);
        if (!group) return res.status(404).json({ error: 'Group not found' });

        const teacher = await findUserById(teacherId);
       // const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(400).json({ error: 'Teacher is not found' });
        }

        const schedule = await createNewSchedule(date , groupId , subject , teacherId);
       // const schedule = new Schedule({ date,group: groupId,subject,teacher: teacherId,});

       // await schedule.save();
        res.status(201).json({ message: 'Schedule created successfully', schedule });
    } catch (error) {
        next(error);
       // res.status(400).json({ error: 'Failed to create schedule', details: error.message });
    }
};

// 9. Редактировать расписание
exports.editSchedule = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const updatedSchedule = await editSchedule(id , req.body);
       // const updatedSchedule = await Schedule.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: 'Schedule updated successfully', updatedSchedule });
    } catch (error) {
        next(error);
       // res.status(400).json({ error: 'Failed to edit schedule', details: error.message });
    }
};

// 10. Заверить расписание
exports.approveSchedule = async (req, res, next) => {
    try {
        const { id } = req.params;
        const schedule = await approveSchedule(id);
       // const schedule = await Schedule.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        res.json({ message: 'Schedule approved successfully', schedule });
    } catch (error) {
        next(error);
        //res.status(400).json({ error: 'Failed to approve schedule', details: error.message });
    }
};


// 11. Создать группу
exports.createGroup = async (req, res,next) => {
    try {
        const { name } = req.body; // спросить каким форматом будут задаваться группы для валидации
        const group = await createNewGroup(name);
       // const group = new Group({ name });
       // await group.save();
        res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
        next(error);
       // res.status(400).json({ error: 'Failed to create group', details: error.message });
    }
};

// 12. Прикрепить студентов к группе
exports.addStudentsToGroup = async (req, res, next) => {
    try {
        const { groupId, studentIds } = req.body;
        const group = await findGroupById(groupId);
       // const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ error: 'Group not found' });
     const students = await findUserWithRoleAndList(studentIds, 'student');
      //  const students = await User.find({ _id: { $in: studentIds }, role: 'student' }); //Обяснить строку
       if (students.length !== studentIds.length) {                                     //И поменять на имя?
          return res.status(400).json({ error: 'Some students not found' });
        }
      await addStudentToGroup(group , studentIds);
      //  group.students.push(...studentIds);
      //  await group.save();

        res.json({ message: 'Students added to group', group });
    } catch (error) {
        next(error);
        //res.status(400).json({ error: 'Failed to add students to group', details: error.message });
    }
};

// 13. Прикрепить учителей к группе
exports.addTeachersToGroup = async (req, res, next) => {
    try {
        const { groupId, teacherIds } = req.body;
          const group = await findGroupById(groupId);
       // const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ error: 'Group not found' });
       
        const teachers = await findUserWithRoleAndList(teacherIds , 'teacher');
       // const teachers = await User.find({ _id: { $in: teacherIds }, role: 'teacher' });
        if (teachers.length !== teacherIds.length) {
            return res.status(400).json({ error: 'Some teachers not found' });
        }
       await addTeacherToGroup(group , teacherIds);
       // group.teachers.push(...teacherIds);
       // await group.save();

        res.json({ message: 'Teachers added to group', group });
    } catch (error) {
       next(error);
        // res.status(400).json({ error: 'Failed to add teachers to group', details: error.message });
    }
};

// 7. Получить статистику по пользователям
exports.getUserStatistics = async (req, res,next) => {
    try {
        const users = await getAllUsers();
       // const users = await User.find();
        const statistics = users.map(user => ({
            userInfo: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
            lastEnteringDate: user.lastEnteringDate || 'Never',
            duration: user.duration || 'N/A', // Logic in logut in routes
        }));

        res.json({ statistics });
    } catch (error) {
        next(error);
        //res.status(400).json({ error: 'Failed to fetch user statistics', details: error.message });
    }
};

