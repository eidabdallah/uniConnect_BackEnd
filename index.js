import express from 'express'
import http from 'http';
import 'dotenv/config';
import { initApp } from './src/modules/app.router.js';
import { initSocket } from './src/utils/socket.js';
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
initApp(app,express);
initSocket(server); 
server.listen(PORT , ()=> {
    console.log(`Server is running ........ ${PORT}`);
});
