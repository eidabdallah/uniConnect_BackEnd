import express from 'express'
import http from 'http';
import 'dotenv/config';
import { initApp } from './src/modules/app.router.js';
import { initSocket } from './src/utils/socket.js';
const PORT = process.env.PORT || 3000;
const app = express();

// Create an HTTP server and pass the Express app to it
// This is necessary to attach socket.io to the same server
const server = http.createServer(app);

initApp(app,express);

// Initialize the socket.io server and attach it to the HTTP server
initSocket(server); 

// We use server.listen instead of app.listen because we created a custom HTTP server (const server = http.createServer(app))
// This allows us to attach both Express and Socket.io to the same server.
server.listen(PORT , ()=> {
    console.log(`Server is running ........ ${PORT}`);
});
