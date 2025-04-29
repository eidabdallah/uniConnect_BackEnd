import cron from 'node-cron';
import userModel from '../../DB/model/user.model.js';

const deleteUnconfirmedAccounts = () => {
  cron.schedule('0 0 1 * *', async () => {
    try {
      const result = await userModel.deleteMany({ confirmEmail: false });
    } catch (error) {
      console.error('Error deleting unconfirmed accounts:', error);
    }
  });
};

export default deleteUnconfirmedAccounts;
