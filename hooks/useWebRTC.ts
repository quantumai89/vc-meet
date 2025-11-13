import { useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { WebRTCManager } from '@/utils/webrtc';
import { User } from '@/types';

export const useWebRTC = (socket: Socket | null, currentUserId: string, users: User[]) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const webrtcManagerRef = useRef<WebRTCManager | null>(null);
  const previousUsersRef = useRef<User[]>([]);

  // Initialize WebRTC when socket and userId are available
  useEffect(() => {
    if (socket && currentUserId && !webrtcManagerRef.current) {
      webrtcManagerRef.current = new WebRTCManager(socket, currentUserId);
      initializeMedia();
    }

    return () => {
      if (webrtcManagerRef.current) {
        webrtcManagerRef.current.cleanup();
        webrtcManagerRef.current = null;
      }
    };
  }, [socket, currentUserId]);

  // Handle new users joining
  useEffect(() => {
    if (!webrtcManagerRef.current || !isInitialized || !currentUserId) return;

    const currentUserIds = users.map((u: User) => u.id);
    const previousUserIds = previousUsersRef.current.map((u: User) => u.id);
    
    // Find new users
    const newUsers = currentUserIds.filter(id => 
      !previousUserIds.includes(id) && id !== currentUserId
    );

    // Create offers for new users (only if we joined first)
    newUsers.forEach(userId => {
      console.log(`Creating offer for new user: ${userId}`);
      webrtcManagerRef.current?.createOffer(userId);
    });

    previousUsersRef.current = users;
  }, [users, currentUserId, isInitialized]);

  // Update remote streams periodically
  useEffect(() => {
    if (!webrtcManagerRef.current) return;

    const interval = setInterval(() => {
      const streams = webrtcManagerRef.current?.getRemoteStreams();
      if (streams) {
        setRemoteStreams(new Map(streams));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const initializeMedia = async () => {
    try {
      if (webrtcManagerRef.current) {
        const stream = await webrtcManagerRef.current.initializeLocalStream();
        setLocalStream(stream);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Failed to initialize media:', error);
      // Try audio-only fallback
      try {
        if (webrtcManagerRef.current) {
          const audioOnlyStream = await webrtcManagerRef.current.initializeLocalStream(false, true);
          setLocalStream(audioOnlyStream);
          setIsVideoMuted(true);
          setIsInitialized(true);
        }
      } catch (audioError) {
        console.error('Failed to initialize audio:', audioError);
      }
    }
  };

  const toggleAudio = useCallback(async () => {
    if (webrtcManagerRef.current) {
      const muted = await webrtcManagerRef.current.toggleAudio();
      setIsAudioMuted(muted);
      return muted;
    }
    return false;
  }, []);

  const toggleVideo = useCallback(async () => {
    if (webrtcManagerRef.current) {
      const muted = await webrtcManagerRef.current.toggleVideo();
      setIsVideoMuted(muted);
      return muted;
    }
    return false;
  }, []);

  const startScreenShare = useCallback(async () => {
    if (webrtcManagerRef.current) {
      const screenStream = await webrtcManagerRef.current.startScreenShare();
      if (screenStream) {
        setIsScreenSharing(true);
        return true;
      }
    }
    return false;
  }, []);

  const stopScreenShare = useCallback(async () => {
    if (webrtcManagerRef.current) {
      await webrtcManagerRef.current.stopScreenShare();
      setIsScreenSharing(false);
    }
  }, []);

  const getLocalVideoElement = useCallback((videoElement: HTMLVideoElement | null) => {
    if (videoElement && localStream) {
      videoElement.srcObject = localStream;
    }
  }, [localStream]);

  const getRemoteVideoElement = useCallback((userId: string, videoElement: HTMLVideoElement | null) => {
    if (videoElement && remoteStreams.has(userId)) {
      videoElement.srcObject = remoteStreams.get(userId) || null;
    }
  }, [remoteStreams]);

  return {
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
    getLocalVideoElement,
    getRemoteVideoElement,
  };
};
