const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken,refreshToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');



router.use(verifyToken,refreshToken);

router.post('/change-password',roleMiddleware('teacher','student'), userController.changePassword);


router.get('/assignments',roleMiddleware('student'),  userController.getAssignments);


router.post('/assignments/:assignmentId/submit',roleMiddleware('student'),  userController.submitAssignment);

router.get('/getJournal',userController.getJournal); // tk. id is tokena


module.exports=router;