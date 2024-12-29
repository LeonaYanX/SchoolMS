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
exports.createAssignment = async (req,res)=>{
    try{
    const {title, description, deadline, groupId}= req.body;
    if(!title||!description||!deadline||!groupId){
       return res.status(400).json({message:'Not all fields are entered'});
    }
    const teacherId = req.params.id;
    const teacher = await User.findById(teacherId);
    if(!teacher){
      return  res.status(403).json({message : 'Cant reqognise you'});
    }
     const group = await Group.findById(groupId);
     if(!group){
       return res.status(404).json({message: 'Group is not found'});
     }

     const assignment = new Assignment({
        title: title,
        description: description,
        deadline:deadline,
        group:groupId,
        teacher: teacherId
     });

     await assignment.save();
     res.status(201).json({message:'Created successfully'}, assignment);

    }catch(error){
        res.status(500).json({error:'Error creating the task'});
    }
};

exports.deleteAssignment = async (req,res)=>{
    try{
        const assignmentId = req.params.id;
        const assignment = await Assignment.findByIdAndDelete(assignmentId);
        if(!assignment){
            return res.status(404).json({message:'Assignment is not found.'});
        }
        res.status(200).json({message:'Assignment deleted successfully.',
            deletedAssignment: assignment});
    }catch(error){
        res.status(500).json({error:'Error during deleting process!'});
    }
};
