'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { useWebRTC } from '@/hooks/useWebRTC';
import VideoTile from '@/components/VideoTile';
import ControlBar from '@/components/ControlBar';
import ChatPanel from '@/components/ChatPanel';
import { User } from '@/types';

interface RoomPageProps {
  params: {
    roomId: string;
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  const { roomId } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const userName = searchParams.get('name') || 'Anonymous';

  console.log('Room Page - roomId:', roomId, 'userName:', userName);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const {
    socket,
    isConnected,
    users,
    currentUserId,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    toggleAudio: socketToggleAudio,
    toggleVideo: socketToggleVideo,
    toggleScreenShare: socketToggleScreenShare,
  } = useSocket();

  const {
    localStream,
    remoteStreams,
    isAudioMuted,
    isVideoMuted,
    isScreenSharing,
    isInitialized,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
  } = useWebRTC(socket, currentUserId, users);

  // Join room when socket connects
  useEffect(() => {
    if (isConnected && !isJoined && userName) {
      joinRoom(roomId, userName);
      setIsJoined(true);
    }
  }, [isConnected, isJoined, roomId, userName, joinRoom]);

  // Handle leaving room
  const handleLeaveRoom = () => {
    leaveRoom();
    router.push('/');
  };

  // Handle audio toggle
  const handleToggleAudio = async () => {
    const muted = await toggleAudio();
    socketToggleAudio(muted);
  };

  // Handle video toggle
  const handleToggleVideo = async () => {
    const muted = await toggleVideo();
    socketToggleVideo(muted);
  };

  // Handle screen share toggle
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenShare();
      socketToggleScreenShare(false);
    } else {
      const success = await startScreenShare();
      if (success) {
        socketToggleScreenShare(true);
      }
    }
  };

  // Get current user
  const currentUser = users.find((user: User) => user.id === currentUserId);
  const otherUsers = users.filter((user: User) => user.id !== currentUserId);

  // Loading state
  if (!isConnected || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vibe-darker">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibe-blue mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to room...</p>
          <p className="text-vibe-gray-light text-sm mt-2">Room: {roomId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vibe-darker relative">
      {/* Main Video Grid */}
      <div className="h-screen p-4 pb-24">
        {users.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-vibe-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👋</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Waiting for others to join</h2>
              <p className="text-vibe-gray-light">Share the room link to invite people</p>
            </div>
          </div>
        ) : (
          <div className={`h-full grid gap-4 ${
            users.length === 1 ? 'grid-cols-1' :
            users.length === 2 ? 'grid-cols-2' :
            users.length <= 4 ? 'grid-cols-2 grid-rows-2' :
            users.length <= 6 ? 'grid-cols-3 grid-rows-2' :
            'grid-cols-3 grid-rows-3'
          }`}>
            {/* Local Video */}
            {currentUser && (
              <VideoTile
                user={currentUser}
                stream={localStream || undefined}
                isLocal={true}
                className="relative"
              />
            )}

            {/* Remote Videos */}
            {otherUsers.map((user) => (
              <VideoTile
                key={user.id}
                user={user}
                stream={remoteStreams.get(user.id)}
                className="relative"
              />
            ))}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <ControlBar
        isAudioMuted={isAudioMuted}
        isVideoMuted={isVideoMuted}
        isScreenSharing={isScreenSharing}
        isChatOpen={isChatOpen}
        roomId={roomId}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
        onToggleScreenShare={handleToggleScreenShare}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onLeaveRoom={handleLeaveRoom}
      />

      {/* Chat Panel */}
      <ChatPanel
        isOpen={isChatOpen}
        messages={messages}
        onSendMessage={sendMessage}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Room Info Header */}
      <div className="fixed top-4 left-4 bg-vibe-dark/80 backdrop-blur-sm rounded-lg px-4 py-2 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <p className="text-white font-medium text-sm">Room: {roomId}</p>
            <p className="text-vibe-gray-light text-xs">
              {users.length} participant{users.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
