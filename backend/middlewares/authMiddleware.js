const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
exports.verifyToken = (req,res,next)=>{
    const token = req.headers['authorization']?.split(' ')[1]; 
    if(!token){
        return res.status(403).json({error:'Token is required'});
    }
    try{
        const decoded = jwt.verify(token,jwtConfig.secretKey);
        //Уточнить что тут твориться 
        req.user=decoded;
        next();
    }catch(error){
        res.status(401).json({error:'Invalid token'});
    }
};


// Функция для обновления токена (если нужно продлить срок действия)
exports.refreshToken = (token, newExpiresIn = '1h') => {
    const payload = verifyToken(token); // Вытаскиваем данные из старого токена
    delete payload.iat; // Удаляем метаданные старого токена
    delete payload.exp;
    return generateToken(payload, newExpiresIn);
};
