const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
         type: String,
          required: true 
        }, // Название задания
    description: {
         type: String, 
         required: true 
        }, // Описание задания
    deadline: {
         type: Date, 
         required: true 
        }, // Крайний срок выполнения
    group: {
         type: mongoose.Schema.Types.ObjectId, ref: 'Group',
          required: true 
        }, // Для какой группы задание
    teacher: {
         type: mongoose.Schema.Types.ObjectId, ref: 'User',
          required: true 
        }, // Учитель
    submissions: [
        {
            student: {
                 type: mongoose.Schema.Types.ObjectId, ref: 'User' 
                }, // Кто сдал
            fileUrl: {
                
                type: String 
            
            }, 
            submittedAt: {
                 type: Date,
                  default: Date.now 
                },
                

            grade: {
                    value: { type: Number, min: 0, max: 100 }, 
                    feedback: { type: String, default: '' }, 
                    gradedAt: { type: Date }, 
                }, 
        }
    ]
    
});

module.exports = mongoose.model('Assignment', assignmentSchema);
