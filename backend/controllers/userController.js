//const User = require('../models/user');
const bcrypt = require('bcrypt');
//const Assignment = require('../models/assignment');
//const Group = require('../models/group');
const { uploadFile } = require('../utils/cloud'); 
  const {findUserById , updateUser } = require('../utils/userServices');
  const {findAssignmentsByGroupWithInfo , findAssignmentById
     , editSubmission , findAssignmentByStudentIdWithInfo } = require('../utils/assignmentsService');

exports.changePassword = async (req,res, next)=>{
    const {id , newPassword} = req.body;

    try{
        //const user = await User.findById(id);
        const user = await findUserById(id);

        if(!user){
           return res.status(404).json({message:'User not found'});
        }

        if(!IsPassChangeAvailable){
           return res.status(403).json({ message:'Password change is not available at the moment. Try again later.'});
        }

        const hashedPass = await bcrypt.hash(newPassword,10); 
        const userUpdated = await updateUser(id , {password: hashedPass , IsPassChangeAvailable: false 
          ,passwordLastChangedAt: new Date()});
       // user.password=hashedPass;
       // user.IsPassChangeAvailable=false;
       // user.passwordLastChangedAt=new Date();

       // await user.save();
        
       return res.status(200).json({message:'Password changed successfully!' , userUpdated});
    }
    catch(error){
       next(error);
       //return res.status(500).json({ message: 'An error occurred while changing the password.' });
    }
};

// Получить все задания для группы пользователя
exports.getAssignments = async (req, res, next) => {
    try {
        const { user } = req;
       const assignments = await findAssignmentsByGroupWithInfo(user.group);
       // const assignments = await Assignment.find({ group: user.group })
        //.populate('teacher', 'firstName lastName');
        res.status(200).json(assignments);
    } catch (error) {
        next(error);
      //res.status(500).json({ message: 'Error getting tasks', error });
    }
};

// Отправка выполненного задания
exports.submitAssignment = async (req, res, next) => {
    try {
      const { assignmentId } = req.params;
      const { file } = req.body; // Получаем файл из запроса
  
      if (!file) {
        return res.status(400).json({ message: 'File is required' });
      }

      const assignment = await findAssignmentById(assignmentId);
  
     // const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        return res.status(404).json({ message: 'Task is not found' });
      }
  
      // Загрузка файла в облако
      const fileUrl = await uploadFile(file);
  
      // Добавление записи в submissions
      await editSubmission(assignment , req.user._id , fileUrl);
      //assignment.submissions.push({
      //  student: req.user._id,
      //  fileUrl,
      //});
  
      //await assignment.save();
  
      res.status(200).json({ message: 'Test sending successfull', fileUrl });
    } catch (error) {
      next(error);
      //res.status(500).json({ message: 'Error sending task', error });
    }
  };

  

  exports.getJournal = async (req, res, next) => {
    try {
        const studentId = req.user._id; // ID студента из токена
        const assignments = await findAssignmentByStudentIdWithInfo(studentId);
       // const assignments = await Assignment.find({
        //    'submissions.student': studentId,
       // }).populate('teacher', 'firstName lastName');

        const journal = assignments.map((assignment) => {
            const submission = assignment.submissions.find(
                (sub) => sub.student.toString() === studentId.toString()
            );

            return {
                title: assignment.title,
                teacher: `${assignment.teacher.firstName} ${assignment.teacher.lastName}`,
                grade: submission?.grade?.value || null,
                feedback: submission?.grade?.feedback || '',
            };
        });

        res.status(200).json(journal);
    } catch (error) {
        console.error('Error getting student journal:', error);
        next(error);
       // res.status(500).json({ message: 'Error getting student journal', error });
    }
};


 