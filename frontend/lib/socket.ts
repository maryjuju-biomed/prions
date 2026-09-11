import { io } from 'socket.io-client';

export function connectSocket(token: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  return io(API_URL, { auth: { token } });
}
