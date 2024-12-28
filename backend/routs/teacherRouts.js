const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { verifyToken,refreshToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(roleMiddleware('teacher'));

router.get('/getUploadedFile', verifyToken,refreshToken, teacherController.getUploadedFile);






module.exports=router;