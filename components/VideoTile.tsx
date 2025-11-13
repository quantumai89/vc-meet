'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, User } from 'lucide-react';
import { User as UserType } from '@/types';

interface VideoTileProps {
  user: UserType;
  stream?: MediaStream;
  isLocal?: boolean;
  className?: string;
}

export default function VideoTile({ user, stream, isLocal = false, className = '' }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        setIsVideoLoaded(true);
      };
    }
  }, [stream]);

  const hasVideo = stream && stream.getVideoTracks().length > 0 && !user.isVideoMuted;
  const hasAudio = stream && stream.getAudioTracks().length > 0 && !user.isAudioMuted;

  return (
    <div className={`video-tile ${className}`}>
      {/* Video Element */}
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} // Mute local video to prevent feedback
          className={`w-full h-full object-cover ${isVideoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-vibe-gray">
          <div className="text-center">
            <User className="w-16 h-16 text-vibe-gray-light mx-auto mb-2" />
            <p className="text-vibe-gray-light text-sm font-medium">{user.name}</p>
          </div>
        </div>
      )}

      {/* User Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-medium truncate">
              {isLocal ? 'You' : user.name}
            </span>
            {user.isScreenSharing && (
              <Monitor className="w-4 h-4 text-vibe-blue" />
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Audio Status */}
            <div className={`p-1 rounded ${user.isAudioMuted ? 'bg-red-600' : 'bg-green-600'}`}>
              {user.isAudioMuted ? (
                <MicOff className="w-3 h-3 text-white" />
              ) : (
                <Mic className="w-3 h-3 text-white" />
              )}
            </div>
            
            {/* Video Status */}
            <div className={`p-1 rounded ${user.isVideoMuted ? 'bg-red-600' : 'bg-green-600'}`}>
              {user.isVideoMuted ? (
                <VideoOff className="w-3 h-3 text-white" />
              ) : (
                <Video className="w-3 h-3 text-white" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {hasVideo && !isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-vibe-dark">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibe-blue"></div>
        </div>
      )}

      {/* Local Indicator */}
      {isLocal && (
        <div className="absolute top-2 left-2 bg-vibe-blue px-2 py-1 rounded text-xs text-white font-medium">
          You
        </div>
      )}
    </div>
  );
}
