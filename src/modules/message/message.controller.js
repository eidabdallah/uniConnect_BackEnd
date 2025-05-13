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
    const io = getIO();
    io.emit('receiveMessage', {
        ...message.toObject(),
        senderName: sender.userName,
        receiverName: receiver.userName,
        senderSlug: sender.slug,
        receiverSlug: receiver.slug
    });
    return res.status(201).json({ success: true, message });
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
    const messagesWithNames = messages.map(message => ({
        ...message.toObject(),
        senderName: sender.userName,
        receiverName: receiver.userName,
        senderSlug: sender.slug,
        receiverSlug: receiver.slug
    }));

    return res.status(200).json({ success: true, messages: messagesWithNames });
};