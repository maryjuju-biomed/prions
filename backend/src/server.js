import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: env.clientOrigin } });

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) throw new Error('No token');
    const user = jwt.verify(token, env.jwtSecret);
    socket.user = user;
    return next();
  } catch {
    return next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  socket.join(socket.user.id);
});

app.set('io', io);

server.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on ${env.port}`);
});
