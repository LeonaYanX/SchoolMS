const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { verifyToken,refreshToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


router.use(roleMiddleware('teacher'));
router.use(verifyToken,refreshToken);

router.get('/getUploadedFile',  teacherController.getUploadedFile);

router.post('/createAssignment/:id',  teacherController.createAssignment);

router.delete('/deleteAssignment/:id',teacherController.deleteAssignment);

router.post('/gradeSubmission/:id',teacherController.gradeSubmission );

router.get('/getJournal',teacherController.getJournal);

module.exports=router;