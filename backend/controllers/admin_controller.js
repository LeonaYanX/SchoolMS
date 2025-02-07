/**@fileoverview Admin dashboard management API */

'use strict';

const {
 findUserById,
 blockUser,
 notApprovedUserList,
 approveUser,
 updateUser,
 getAllUsers,
 deleteUserById,
 createNewUser,
 findUserWithRoleAndList 
} = require('../utils/userServices');

const {
 findGroupById,
 createNewGroup, 
 addTeacherToGroup,
 addStudentToGroup
} = require('../utils/groupServices');

const {
 approveSchedule,
 editSchedule,
 createNewSchedule
} = require('../utils/sheduleServices');

/**
 * Creates a new user
 */
exports.createUser = async (req, res, next) => {
    try {
     const {firstName , lastName , role , email ,password} = req.body;
     await createNewUser(firstName , lastName , role , email , password);
     res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      next(error);
    }
};

/**
 * Delete user by ID
 */
exports.deleteUser = async (req, res, next) => {
    try {
     const { id } = req.params;
     await deleteUserById(id);
     res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
};

/**
 * Get all users list
 */
exports.getAllUsers = async (req, res, next) => {
    try {
     const users = await getAllUsers();
     res.json(users);
    } catch (error) {
      next(error);
    }
};

/**
 * Update user with the parameters in the request body.
 */
exports.updateUser = async (req, res , next) => {
    try {
     const { id } = req.params;
     const updatedUser = await updateUser(id , req.body );
     res.json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
      next(error);
    }
};

/**
 * Approve not approved user
 */
exports.approveUser = async (req, res, next) => {
    try {
     const { id } = req.params; 
     const user = await approveUser(id);
     res.json({ message: 'User approved successfully', user });
    } catch (error) {
      next(error);
    }
};

/**
 * Shows all not approved users list.
 */
exports.notApprovedUserList = async (req , res,next)=>{
    try{
     const users = await notApprovedUserList();
     if(users.length===0){
      res.status(404).json({message:'There is no not approved users.'});
     }
     res.json(users);
    }catch(error){
     next(error);
    }
};

/**
 * Blocks a user for a specified duration.
 */
exports.blockUser = async (req, res, next) => {
    try {
     const { id } = req.params;
     const { duration } = req.body; 
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
       case 'forever': 
         expiry.setFullYear(9999);
         break;
       default:
         return res.status(400).json({ error: 'Invalid duration' });
        }

     const user = await blockUser(id , expiry);
     res.json({ message: 'User blocked successfully', blockExpiry: expiry, user });
    } catch (error) {
      next(error);
    }
};

/**
 * Create a new schedule.
 */
exports.createSchedule = async (req, res, next) => {
    try {
     const { date, groupId, subject, teacherId } = req.body;
     const group = await findGroupById(groupId);
      if (!group) return res.status(404).json({ error: 'Group not found' });

     const teacher = await findUserById(teacherId);
      if (!teacher || teacher.role !== 'teacher') {
       return res.status(400).json({ error: 'Teacher is not found' });
      }
     
     const schedule = await createNewSchedule(date , groupId , subject , teacherId);
     res.status(201).json({ message: 'Schedule created successfully', schedule });
    } catch (error) {
      next(error);
    }
};
/**
 * Edits an existing schedule.
 */
exports.editSchedule = async (req, res, next) => {
    try {
     const { id } = req.params; 
     const updatedSchedule = await editSchedule(id , req.body);
     res.json({ message: 'Schedule updated successfully', updatedSchedule });
    } catch (error) {
      next(error);
    }
};

/**
 * Approves the schedule.
 */
exports.approveSchedule = async (req, res, next) => {
    try {
     const { id } = req.params;
     const schedule = await approveSchedule(id);
     res.json({ message: 'Schedule approved successfully', schedule });
    } catch (error) {
      next(error);
    }
};

/**
 * Creating a new group of students.
 */
exports.createGroup = async (req, res,next) => {
    try {
     const { name } = req.body; 
     const group = await createNewGroup(name);
     res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
        next(error);
    }
};

/**
 * Attouch students to existing group.
 */
exports.addStudentsToGroup = async (req, res, next) => {
    try {
     const { groupId, studentIds } = req.body;
     const group = await findGroupById(groupId);
      if (!group) return res.status(404).json({ error: 'Group not found' });

     const students = await findUserWithRoleAndList(studentIds, 'student');
      if (students.length !== studentIds.length) {                                     
       return res.status(400).json({ error: 'Some students not found' });
      }

      await addStudentToGroup(group , studentIds);
      res.json({ message: 'Students added to group', group });
    } catch (error) {
      next(error);
    }
};

/**
 * Attouchs several teachers to existing group.
 */
exports.addTeachersToGroup = async (req, res, next) => {
    try {
     const { groupId, teacherIds } = req.body;
     const group = await findGroupById(groupId);
      if (!group) return res.status(404).json({ error: 'Group not found' });
       
     const teachers = await findUserWithRoleAndList(teacherIds , 'teacher');
      if (teachers.length !== teacherIds.length) {
       return res.status(400).json({ error: 'Some teachers not found' });
      }

     await addTeacherToGroup(group , teacherIds);
     res.json({ message: 'Teachers added to group', group });
    } catch (error) {
      next(error);
    }
};

/**
 * Retrieves user statistics.
 */
exports.getUserStatistics = async (req, res,next) => {
    try {
     const users = await getAllUsers();
     const statistics = users.map(user => ({
            userInfo: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
            lastEnteringDate: user.lastEnteringDate || 'Never',
            duration: user.duration || 'N/A',
        }));
     res.json({ statistics });
    } catch (error) {
      next(error);
    }
};

