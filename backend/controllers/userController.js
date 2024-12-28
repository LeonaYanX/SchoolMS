const User = require('../models/user');
const bcrypt = require('bcrypt');
const Assignment = require('../models/assignment');
const Group = require('../models/group');
const { uploadFile } = require('../utils/cloud'); 

exports.changePassword = async (req,res)=>{
    const {id , newPassword} = req.body;

    try{
        const user = await User.findById(id);

        if(!user){
           return res.status(404).json({message:'User not found'});
        }

        if(!IsPassChangeAvailable){
           return res.status(403).json({ message:'Password change is not available at the moment. Try again later.'});
        }

        const hashedPass = await bcrypt.hash(newPassword,10); 
        user.password=hashedPass;
        user.IsPassChangeAvailable=false;
        user.passwordLastChangedAt=new Date();

        await user.save();
        
       return res.status(200).json({message:'Password changed successfully!'});
    }
    catch(error){
       return res.status(500).json({ message: 'An error occurred while changing the password.' });
    }
};

// Получить все задания для группы пользователя
exports.getAssignments = async (req, res) => {
    try {
        const { user } = req;
        const assignments = await Assignment.find({ group: user.group }).populate('teacher', 'firstName lastName');//понять популейт что делает
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Error getting tasks', error });
    }
};

// Отправка выполненного задания
exports.submitAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const { file } = req.body; // Получаем файл из запроса
  
      if (!file) {
        return res.status(400).json({ message: 'File is required' });
      }
  
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        return res.status(404).json({ message: 'Task is not found' });
      }
  
      // Загрузка файла в облако
      const fileUrl = await uploadFile(file);
  
      // Добавление записи в submissions
      assignment.submissions.push({
        student: req.user._id,
        fileUrl,
      });
  
      await assignment.save();
  
      res.status(200).json({ message: 'Test sending successfull', fileUrl });
    } catch (error) {
      res.status(500).json({ message: 'Error sending task', error });
    }
  };

 