const User = require('../models/user');
async function createNewUser(firstName , lastName , role , email , password) {
    const user = new User({
        firstName: firstName,
        lastName: lastName , 
        role: role,
        email: email,
        password: password
    });
    await user.save();
    return user;
}

async function deleteUserById(id){
  const user =   await User.findByIdAndDelete(id);
 return user;
}

async function getAllUsers(){
    const users = await User.find();
    return users;
}

async function updateUser(id , data) {
    const updatedUser = await User.findByIdAndUpdate(id,data , {new : true});
    return updatedUser;  
}
async function approveUser(id) {
    const user = await User.findByIdAndUpdate(id,{IsApproved:true} , {new : true});
    return user; 
}
async function notApprovedUserList() {
    const users = await User.find({IsApproved : false});
    return users;
}
async function blockUser(id , expiry) {
    const user = await User.findByIdAndUpdate(
        id,
        { IsBlocked: true, blockExpiry: expiry }, 
        
        { new: true }
    );
    return user;
}
async function findUserById(id) {
    const user = await User.findById(id); 
    return user;
}

async function findUserWithRoleAndList(usersIdsList , role) {
    const users = await User.find({ _id: { $in: usersIdsList }, role:role }); 

    return users;
}

async function isAnExistingUser(email) {
    const user = await User.findOne({email});
    if (user){
        return true;
    }
    return false;
}

async function findUserByEmail(email) {
    const user = await User.findOne({email});
    return user;
}

async function refreshLastLoginDate(user) {
    user.lastLogin = new Date();
    await user.save();
}

module.exports = {findUserById , blockUser , notApprovedUserList 
    , approveUser , updateUser , getAllUsers , deleteUserById , createNewUser 
    , findUserWithRoleAndList , isAnExistingUser , findUserByEmail , refreshLastLoginDate };


                     

                               

                             