import { Server } from 'socket.io';
import userModel from './../../DB/model/user.model.js';
import notificationModel from '../../DB/model/notification.model.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinRoom', (userSlug) => {
      if (!userSlug) return;
      if (!socket.rooms.has(userSlug)) {
        socket.join(userSlug);
      }
    });
    socket.on('sendMessage', (data) => {
      const { senderSlug, receiverSlug } = data;
      io.to(senderSlug).to(receiverSlug).emit('receiveMessage', data);
    });
    socket.on('sendNotification', async (data) => {
      try {
        const { userId, content, notificationType } = data;
        const newNotification = await notificationModel.create({
          userId,
          content,
          notificationType
        });
        const user = await userModel.findById(userId).select('slug');
        if (!user) return;
        io.to(user.slug).emit('receiveNotification', newNotification);
      } catch (error) {
        console.error('❌ Error in sendNotification socket event:', error.message);
      }
    });
    socket.on('disconnect', () => {
      // console.log('❌ User disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
