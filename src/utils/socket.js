import { Server } from 'socket.io';
// Server: A class from the socket.io library.
// Used to create a WebSocket server that enables real-time communication between the server and clients.

let io; // Declare a variable to store the socket.io instance

export const initSocket = (server) => {
  // Initialize the socket.io server and attach it to the existing HTTP server
  io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins (you can restrict this in production)
      methods: ["GET", "POST"] // Allowed HTTP methods
    }
  });

  // Listen for new client connections
  io.on('connection', (socket) => {
    // console.log(`User connected: ${socket.id}`); // Optional: log the connected user's ID

    socket.on('joinRoom', (userSlug) => {
      socket.join(userSlug);
    });

    // Listen for 'sendMessage' events from the client
    socket.on('sendMessage', (data) => {
      const { senderSlug, receiverSlug } = data;
      io.to(senderSlug).to(receiverSlug).emit('receiveMessage', data);
    });

    // Listen for client disconnection
    socket.on('disconnect', () => {
      // console.log('❌ User disconnected:', socket.id); // Optional: log when user disconnects
    });
  });

  return io; // Return the socket.io instance
};

// getIO: Used to access the initialized socket instance from anywhere in the project
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized"); // Throw error if called before initialization
  return io;
};
