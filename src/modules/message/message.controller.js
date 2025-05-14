import { getIO } from '../../utils/socket.js';
import * as messageService from './message.service.js';

export const sendMessageController = async (req, res, next) => {
    const { receiverSlug, content } = req.body;
    const senderSlug = req.user.slug;
    const sender = await messageService.checkUserSlug(senderSlug);
    const receiver = await messageService.checkUserSlug(receiverSlug);
    if (!sender || !receiver) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }
    const message = await messageService.sendMessage({ senderId: sender._id, receiverId: receiver._id, content });
    const populatedMessage = await message.populate([
        { path: "senderId", select: "slug userName" },
        { path: "receiverId", select: "slug userName" }
    ]);
    const io = getIO();
    // Emit the new message in real-time to all 
    io.to(populatedMessage.senderId.slug)
        .to(populatedMessage.receiverId.slug)
        .emit('receiveMessage', populatedMessage);

    return res.status(201).json({ success: true, message: populatedMessage });
};
export const getMessagesController = async (req, res, next) => {
    const senderSlug = req.user.slug;
    const { receiverSlug } = req.query;
    const sender = await messageService.checkUserSlug(senderSlug);
    const receiver = await messageService.checkUserSlug(receiverSlug);

    if (!sender || !receiver) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }
    const messages = await messageService.getMessagesBetweenUsers(sender._id, receiver._id);
    if (!messages || messages.length === 0) {
        return res.status(200).json({
            success: true,
            messages: [],
            message: 'No messages found between the users'
        });
    }
    const messagesWithNames = messages.map(message => ({ ...message.toObject() }));

    return res.status(200).json({ success: true, messages: messagesWithNames });
};