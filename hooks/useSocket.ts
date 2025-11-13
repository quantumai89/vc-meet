import { useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import SocketManager from '@/utils/socket';
import { User, ChatMessage } from '@/types';

export const useSocket = (roomId?: string, userName?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const socketManager = SocketManager.getInstance();
    const socketInstance = socketManager.connect();
    
    setSocket(socketInstance);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    
    const handleRoomUsers = (roomUsers: User[]) => {
      setUsers(roomUsers);
    };

    const handleUserJoined = (user: User) => {
      setUsers((prev: User[]) => [...prev, user]);
    };

    const handleUserLeft = (userId: string) => {
      setUsers((prev: User[]) => prev.filter((user: User) => user.id !== userId));
    };

    const handleUserId = (userId: string) => {
      setCurrentUserId(userId);
    };

    const handleNewChatMessage = (message: ChatMessage) => {
      setMessages((prev: ChatMessage[]) => [...prev, message]);
    };

    const handleChatHistory = (history: ChatMessage[]) => {
      setMessages(history);
    };

    const handleUserAudioToggled = ({ userId, isAudioMuted }: { userId: string; isAudioMuted: boolean }) => {
      setUsers((prev: User[]) => prev.map((user: User) => 
        user.id === userId ? { ...user, isAudioMuted } : user
      ));
    };

    const handleUserVideoToggled = ({ userId, isVideoMuted }: { userId: string; isVideoMuted: boolean }) => {
      setUsers((prev: User[]) => prev.map((user: User) => 
        user.id === userId ? { ...user, isVideoMuted } : user
      ));
    };

    const handleUserScreenShareToggled = ({ userId, isScreenSharing }: { userId: string; isScreenSharing: boolean }) => {
      setUsers((prev: User[]) => prev.map((user: User) => 
        user.id === userId ? { ...user, isScreenSharing } : user
      ));
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.on('room-users', handleRoomUsers);
    socketInstance.on('user-joined', handleUserJoined);
    socketInstance.on('user-left', handleUserLeft);
    socketInstance.on('user-id', handleUserId);
    socketInstance.on('new-chat-message', handleNewChatMessage);
    socketInstance.on('chat-history', handleChatHistory);
    socketInstance.on('user-audio-toggled', handleUserAudioToggled);
    socketInstance.on('user-video-toggled', handleUserVideoToggled);
    socketInstance.on('user-screen-share-toggled', handleUserScreenShareToggled);

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('room-users', handleRoomUsers);
      socketInstance.off('user-joined', handleUserJoined);
      socketInstance.off('user-left', handleUserLeft);
      socketInstance.off('user-id', handleUserId);
      socketInstance.off('new-chat-message', handleNewChatMessage);
      socketInstance.off('chat-history', handleChatHistory);
      socketInstance.off('user-audio-toggled', handleUserAudioToggled);
      socketInstance.off('user-video-toggled', handleUserVideoToggled);
      socketInstance.off('user-screen-share-toggled', handleUserScreenShareToggled);
    };
  }, []);

  const joinRoom = useCallback((roomId: string, userName: string) => {
    if (socket) {
      socket.emit('join-room', { roomId, userName });
    }
  }, [socket]);

  const leaveRoom = useCallback(() => {
    if (socket) {
      socket.emit('leave-room', {});
    }
  }, [socket]);

  const sendMessage = useCallback((message: string) => {
    if (socket && message.trim()) {
      socket.emit('chat-message', { message: message.trim() });
    }
  }, [socket]);

  const toggleAudio = useCallback((isAudioMuted: boolean) => {
    if (socket) {
      socket.emit('toggle-audio', { isAudioMuted });
    }
  }, [socket]);

  const toggleVideo = useCallback((isVideoMuted: boolean) => {
    if (socket) {
      socket.emit('toggle-video', { isVideoMuted });
    }
  }, [socket]);

  const toggleScreenShare = useCallback((isScreenSharing: boolean) => {
    if (socket) {
      socket.emit('toggle-screen-share', { isScreenSharing });
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    users,
    currentUserId,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  };
};
