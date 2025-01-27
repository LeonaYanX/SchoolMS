
const Schedule = require('../models/schedule');
async function createNewSchedule(date,groupId,subject,teacherId){
       const schedule = new Schedule({
            date: date,
            group: groupId,
            subject: subject,
            teacher: teacherId,
        });

        await schedule.save();

        return schedule;
    }

   
       async function editSchedule(id,data) {
        const updatedSchedule = await Schedule.findByIdAndUpdate(id, data , { new: true });
        return updatedSchedule;
        
       } 
       async function approveSchedule(id) {
        const schedule = await Schedule.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        return schedule;
       }
module.exports = {approveSchedule , editSchedule , createNewSchedule};

               