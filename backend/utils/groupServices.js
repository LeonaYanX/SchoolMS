 const Group = require('../models/group');
 const User = require('../models/user');
 async function findGroupById(groupId){
    const group = await Group.findById(groupId);
    return group;
 }

 async function createNewGroup(name) {
    const group =  new Group({name});
    await group.save();
    return group;
 }
 async function addTeacherToGroup(group,teacherIds) {

         
                 group.teachers.push(...teacherIds);
                 await group.save();
                 return group; 
                 
 }

async function addStudentToGroup(group,studentIds) {

     group.students.push(...studentIds);
     await group.save();
     return group 
        }

module.exports={findGroupById , createNewGroup , addTeacherToGroup, addStudentToGroup };
         
                 
         

              