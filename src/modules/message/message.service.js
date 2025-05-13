import messageModel from "../../../DB/model/message.model.js";
import userModel from "../../../DB/model/user.model.js";

export const checkUserSlug = async (slug) => {
    return await userModel.findOne({ slug });
}
export const sendMessage = async ({ senderId, receiverId, content }) => {
    const message = new messageModel({ senderId, receiverId, content });
    return await message.save();
};

export const getMessagesBetweenUsers = async (user1, user2) => {
    return await messageModel.find({
        $or: [
            { senderId: user1, receiverId: user2 },
            { senderId: user2, receiverId: user1 }
        ]
    }).sort({ createdAt: 1 });
};