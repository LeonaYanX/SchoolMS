/**@fileoverview JWT configuration settings*/

'use strict';

module.exports={
    secretKey:process.env.JWT_SECRET,
    expiresIn: '1h' 
};