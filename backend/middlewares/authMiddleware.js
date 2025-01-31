const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
//const User = require('../models/user');
const generateTokens = require('../utils/token');
const RefreshToken = require('../models/refreshToken');
exports.verifyToken = (req,res,next)=>{
    const token = req.headers['authorization']?.split(' ')[1]; 
    if(!token){
        return res.status(403).json({error:'Token is required'});
    }
    try{
        const decoded = jwt.verify(token,jwtConfig.secretKey);
        // Decode the token and store the decoded user data on req.user to use it again then
        req.user=decoded;
        next();
    }catch(error){
        res.status(401).json({error:'Invalid token'});
    }
};


// token update function (If we need to extend the deadline)

exports.refreshToken = async (refreshT)=>{
    try{
    const storedToken = await RefreshToken.findOne({token: refreshT});
    if(!storedToken || storedToken.expiresAt<Date.now()){
        throw new Error('Refresh token is invalid or expired');
    }
    return generateTokens(storedToken.userId);
    }catch(err){
        console.log('Error in refreshToken authMiddleware');
        throw new Error('Failed to refresh token: User not found or token invalid');
    }
};
//exports.refreshToken = async (token, newExpiresIn = '1h') => {
 //   const payload = verifyToken(token); // getting data from the old token
 //   try{
 //   const user = await User.findById(payload.id);
 //   if(!user || user.IsBlocked)
 //   {
 //      throw new Error('User access revoked');
 //   }
                /* delete payload.iat; // deleting metas of the old token
                   delete payload.exp;*/
  //  return generateToken(
  //      {
  //      id : payload.id ,
  //      email : payload.email
   //     } , newExpiresIn);
  //    }
  //    catch(err)
   //   {
   //     console.log('Problem with getting user by this id' , err);
    //    throw new Error('Failed to refresh token: User not found or token invalid'); 
   //   }
//};

