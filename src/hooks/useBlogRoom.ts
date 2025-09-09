import { useEffect } from 'react';
import { useSocket } from '@/provider/SocketProvider';

export const useBlogRoom = (blogId: string | undefined) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !blogId) return;

    // Join the specific blog room
    socket.emit('join_blog', blogId);

    // Cleanup: leave room when component unmounts
    return () => {
      socket.emit('leave_blog', blogId);
    };
  }, [socket, blogId]);

  return socket;
};