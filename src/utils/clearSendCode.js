import userModel from "../../DB/model/user.model.js";
import cron from 'node-cron';

const cleanupSendCodes = () => {
    cron.schedule('0 0 1 * *', async () => {
        try {
            const result = await userModel.updateMany(
                { sendCode: { $ne: null } },
                { $set: { sendCode: null } }
            );
            console.log(`Cleared sendCode for ${result.modifiedCount} users.`);
        } catch (error) {
            console.error('Error cleaning up send codes:', error);
        }
    });
};
export default cleanupSendCodes;
