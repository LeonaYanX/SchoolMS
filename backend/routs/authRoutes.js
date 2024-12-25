const express = require('express');

const {register,login} = require('../controllers/authController');

const router = express.Router();

router.get('/register',(req,res)=>{
    res.render('register',{
        title:'Registration'
    });
});
router.post('/register',register);

router.get('/',(req,res)=>{
    res.render('index',{
        title:'Home'
    });
});

router.post('/',login);

module.exports=router;