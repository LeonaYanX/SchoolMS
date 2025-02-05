const cron = require('node-cron');
const User = require('../models/user');


// Scheduler for IsPassChangAvailable field
const schedulePasswordUpdate = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running password update job...');
    try {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
     // Updating all users 
      const users = await User.updateMany(
      {
         IsPassChangeAvailable: false,
         passwordLastChangedAt: { $lte: oneMonthAgo },
      },
      { $set: { IsPassChangeAvailable: true } }
    );

   console.log(`Updated ${users.modifiedCount} users to allow password change.`);
      /*// Finding Useres that can't change their pass for more than a month
      const users = await User.find({
        IsPassChangeAvailable: false,
        passwordLastChangedAt: { $lte: oneMonthAgo },
      });

      // Update Users
      for (const user of users) {
        user.IsPassChangeAvailable = true;
        await user.save();
      }

      console.log(`Updated ${users.length} users to allow password change.`);*/
    } catch (error) {
      console.error('Error updating users:', error);
    }
  });
};

// Scheduler checkAndUnblock for all Users
const scheduleUnblockUsers = () => {
    cron.schedule('0 * * * *', async () => { // Starting every hour
      console.log('Running unblock task...');
      try {
        // finding all blocked Users and unblocking
        const blockedUsers = await User.find({ IsBlocked: true, blockExpiry: { $lte: new Date() } },
      {$set: {IsBlocked:false}});
        console.log(`Processed ${blockedUsers.length} blocked users.`);
      } catch (error) {
        console.error('Error during scheduled unblock:', error);
      }
    });
  };

module.exports = {schedulePasswordUpdate , scheduleUnblockUsers};
