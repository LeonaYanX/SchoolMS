//const Assignment = require('../models/assignment');
//const User = require('../models/user');
//const Group = require('../models/group');
const {findAssignmentByTeachersId , createAssignment 
    , deleteAssignmentById , findAssignmentById 
    , gradeAssignment , findAssignmentByTeacherIdWithInfo} = require('../utils/assignmentsService');
const {findUserById} = require('../utils/userServices');
const {findGroupById} = require('../utils/groupServices');
exports.getUploadedFile = async (req, res, next) => {
    const teacherId = req.params.teacherId; // Taking teachers ID from request params

    try {
        // Finding assignment where this teacher is specified.
       // const assignments = await Assignment.find({ teacher: teacherId });
       const assignments = await findAssignmentByTeachersId(teacherId);

        // If there is no assignments
        if (assignments.length < 1) {
            return res.status(200).json({ message: 'There are no tasks at this moment.' });
        }

        // Taking all the submissions from assignments
        const submissions = assignments
            .map(assignment => assignment.submissions) // We have an array of `submissions` 
            .flat();                                   // "Flattening" into a single array

        
        if (submissions.length < 1) {
            return res.status(200).json({ message: 'There are no submissions yet.' });
        }

        
        res.status(200).json(submissions);
    } catch (error) {
        console.error('Error getting uploaded files:', error);
        next(error);
       // res.status(500).json({ error: 'Something went wrong.' });
    }
};
exports.createAssignment = async (req,res,next)=>{
    try{
    const {title, description, deadline, groupId}= req.body;
    if(!title||!description||!deadline||!groupId){
       return res.status(400).json({message:'Not all fields are entered'});
    }
    const teacherId = req.params.id;
    const teacher = await findUserById(teacherId);
   // const teacher = await User.findById(teacherId);
    if(!teacher){
      return  res.status(403).json({message : 'Cant reqognise you'});
    }
    const group = await findGroupById(groupId);
    // const group = await Group.findById(groupId);
     if(!group){
       return res.status(404).json({message: 'Group is not found'});
     }

    /* const assignment = new Assignment({
        title: title,
        description: description,
        deadline:deadline,
        group:groupId,
        teacher: teacherId
     });*/

    // await assignment.save();
    const assignment = await createAssignment(title , description , deadline , groupId , teacherId);
     res.status(201).json({message:'Created successfully'}, assignment);

    }catch(error){
       next(error);
        // res.status(500).json({error:'Error creating the task'});
    }
};

exports.deleteAssignment = async (req,res,next)=>{
    try{
        const assignmentId = req.params.id;
        const assignment = await deleteAssignmentById(assignmentId);
       // const assignment = await Assignment.findByIdAndDelete(assignmentId);
        if(!assignment){
            return res.status(404).json({message:'Assignment is not found.'});
        }
        res.status(200).json({message:'Assignment deleted successfully.',
            deletedAssignment: assignment});
    }catch(error){
        next(error);
        //res.status(500).json({error:'Error during deleting process!'});
    }
};
exports.gradeSubmission = async(req,res,next)=>{
    const {assignmentId, studentId, grade, feedback} =req.body;
    const teacherId = req.params.id;
    try{
        //const assignment = await Assignment.findById(assignmentId);
        const assignment = await findAssignmentById(assignmentId);
        if(!assignment){
            return res.status(404).json({message:'Assignment not found'});
        }
        if(assignment.teacher.toString()!==teacherId.toString()){
            return res.status(403).json({message:'You are not allowed to grade this assignment'});
        }
        const submission = await gradeAssignment(assignment , studentId , grade , feedback);
       // const submission =assignment.submissions.find((sub)=>sub.student.toString()===studentId.toString());
      //  if(!submission){
       //     return res.status(404).json({ message: 'Submission not found for the student' });
       // }
      //  submission.grade ={
      //      value: grade,
      //      feedback:feedback || '',
      //      gradedAt: new Date()
       // }; 
       // assignment.save();
        res.status(200).json({ message: 'Grade submitted successfully', submission });
    } catch (error) {
        console.error('Error grading submission:', error);
       next(error);
        // res.status(500).json({ message: 'Error grading submission', error });
    }
};


exports.getJournal = async (req, res , next) => {
    try {
        const teacherId = req.user._id; // ID учителя из токена
        const assignments = await findAssignmentByTeacherIdWithInfo({teacherId});
        
       // const assignments = await Assignment.find({ teacher: teacherId })
       //     .populate('group', 'name')
       //     .populate('submissions.student', 'firstName lastName');

        const journal = assignments.map((assignment) => ({
            title: assignment.title,
            group: assignment.group.name,
            submissions: assignment.submissions.map((submission) => ({
                student: `${submission.student.firstName} ${submission.student.lastName}`,
                grade: submission.grade.value,  // ? || null todo
                feedback: submission.grade.feedback,
            })),
        }));

        res.status(200).json(journal);
    } catch (error) {
        console.error('Error getting journal:', error);
       next(error);
        // res.status(500).json({ message: 'Error getting journal', error });
    }
};

