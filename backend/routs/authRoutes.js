const express = require('express');

const {register,login} = require('../controllers/authController');

const { validate } = require('../middlewares/validators');
const {createUserRules} = require('../validators/userValidator');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();



router.get('/register',createUserRules,validate,(req,res)=>{
    res.render('register',{
        title:'Registration'
    });
});
router.post('/register', validateRegister, register);

router.get('/',(req,res)=>{
    res.render('index',{
        title:'Home'
    });
});

router.post('/',login);

router.post('/logout',verifyToken, async (req, res) => {
    const userId = req.userId; // Получаем ID пользователя 

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Рассчитываем длительность нахождения на сайте
        if (user.lastLogin) {
            const now = new Date();
            const duration = Math.floor((now - user.lastLogin) / (1000 * 60)); // В минутах
            user.duration = duration;
            await user.save();
            console.log(`User ${user.email} spent ${duration} minutes on the site.`);
        }

        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports=router;