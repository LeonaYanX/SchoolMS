const jwt = require('jsonwebtoken');
exports.verifyToken = (req,res,next)=>{
    const token = req.headers['authorization']?.split(' ')[1]; //Уточнить что тут твориться 
    if(!token){
        return res.status(403).json({error:'Token is required'});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        //Уточнить что тут твориться 
        req.user=decoded;
        next();
    }catch(error){
        res.status(401).json({error:'Invalid token'});
    }
};