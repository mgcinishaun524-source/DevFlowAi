import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(window.location.origin);
  }
  return socket;
};

export const joinProject = (projectId: string, userId: string, displayName: string) => {
  const s = getSocket();
  s.emit('join-project', { projectId, userId, displayName });
};

export const emitTaskUpdate = (projectId: string, taskId: string, status: string) => {
  const s = getSocket();
  s.emit('task-update', { projectId, taskId, status });
};

export const emitChatMessage = (projectId: string, text: string, userId: string, displayName: string) => {
  const s = getSocket();
  s.emit('chat-message', { projectId, text, userId, displayName });
};
