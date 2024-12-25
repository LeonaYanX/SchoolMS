const {Router}= require('express')

const router=Router()

  

router.get('/students',(req,res)=>{
    res.render('students',{
        title:'For Students'
    })
})

router.get('/teachers',(req,res)=>{
    res.render('teachers',{
        title:'For Teachers'
    })
})

router.get('/about',(req,res)=>{
    res.render('about',{
        title:'About Us'
    })
})

router.get('/contacts',(req,res)=>{
    res.render('contacts',{
        title:'Contact Us'
    })
})


module.exports = router