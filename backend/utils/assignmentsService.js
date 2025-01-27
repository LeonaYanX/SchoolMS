const Assignment = require('../models/assignment');

async function findAssignmentByTeachersId(teacherId) {
    const assignment = Assignment.find({teacher : teacherId});
    return assignment;
}

async function createAssignment(title , description, deadline, groupId, teacherId) {
    const assignment = new Assignment({
        title: title,
        description: description,
        deadline: deadline,
        group: groupId,
        teacher: teacherId
    });
    await assignment.save();

    return assignment;
}

async function deleteAssignmentById(id) {
    const assignment = await Assignment.findByIdAndDelete(id);

    return assignment
}

async function findAssignmentById(id) {
    const assignment = await Assignment.findById(id);

    return assignment;
}

async function gradeAssignment (assignment , studentId , grade , feedback) {
    const submission =assignment.submissions.find((sub)=>sub.student.toString()===studentId.toString());
        if(!submission){
            throw new Error('Submission not found for the student' );
        }
        submission.grade ={
            value: grade,
            feedback:typeof(feedback)===undefined?'':feedback ,
            gradedAt: new Date()
        }; 
        assignment.save();

        return submission;
}

async function findAssignmentByTeacherIdWithInfo(teacherId) {
    const assignments = await Assignment.find({ teacher: teacherId })
      .populate('group', 'name')
      .populate('submissions.student', 'firstName lastName');

      return assignments; 
}

module.exports = {findAssignmentByTeachersId , createAssignment , 
    deleteAssignmentById , findAssignmentById , gradeAssignment
    ,findAssignmentByTeacherIdWithInfo};