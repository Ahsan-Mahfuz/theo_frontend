import { io, type Socket } from 'socket.io-client';
import { API_ORIGIN } from './config';

let socket: Socket | null = null;
let currentToken: string | null = null;

/**
 * Returns a shared Socket.io connection authenticated with the given JWT.
 * The backend expects the token under `auth.token` (see backend/src/app/socket).
 * Re-uses one connection per token for the whole app.
 */
export const getSocket = (token: string): Socket => {
  if (socket && currentToken === token) {
    if (!socket.connected) socket.connect();
    return socket;
  }
  // Token changed (new login) — tear down the old connection first.
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  currentToken = token;
  socket = io(API_ORIGIN, {
    auth: { token },
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  });
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
  currentToken = null;
};
