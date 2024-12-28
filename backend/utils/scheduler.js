const cron = require('node-cron');
const User = require('../models/user');


// планировщик для обновления поля
const schedulePasswordUpdate = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running password update job...');
    try {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      // Найти пользователей, которые не могут менять пароль больше месяца
      const users = await User.find({
        IsPassChangeAvailable: false,
        passwordLastChangedAt: { $lte: oneMonthAgo },
      });

      // Обновить пользователей
      for (const user of users) {
        user.IsPassChangeAvailable = true;
        await user.save();
      }

      console.log(`Updated ${users.length} users to allow password change.`);
    } catch (error) {
      console.error('Error updating users:', error);
    }
  });
};

// Планировщик checkAndUnblock для всех пользователей
const scheduleUnblockUsers = () => {
    cron.schedule('0 * * * *', async () => { // Запуск каждый час
      console.log('Running unblock task...');
      try {
        // Найти всех заблокированных пользователей
        const blockedUsers = await User.find({ IsBlocked: true, blockExpiry: { $lte: new Date() } });
  
        for (const user of blockedUsers) {
          await user.checkAndUnblock(); // Вызов метода checkAndUnblock
        }
  
        console.log(`Processed ${blockedUsers.length} blocked users.`);
      } catch (error) {
        console.error('Error during scheduled unblock:', error);
      }
    });
  };

module.exports = {schedulePasswordUpdate , scheduleUnblockUsers};
