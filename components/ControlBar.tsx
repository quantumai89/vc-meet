'use client';

import { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, MessageSquare, Phone, Settings, Copy, Check } from 'lucide-react';

interface ControlBarProps {
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  roomId: string;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onLeaveRoom: () => void;
}

export default function ControlBar({
  isAudioMuted,
  isVideoMuted,
  isScreenSharing,
  isChatOpen,
  roomId,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onLeaveRoom,
}: ControlBarProps) {
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyRoomLink = async () => {
    const roomLink = `${window.location.origin}/room/${roomId}`;
    try {
      await navigator.clipboard.writeText(roomLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room link:', err);
    }
  };

  return (
    <>
      {/* Room Info Modal */}
      {showRoomInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-vibe-dark p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Room Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-vibe-gray-light mb-1">Room ID</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={roomId}
                    readOnly
                    className="input-field flex-1 text-sm"
                  />
                  <button
                    onClick={copyRoomLink}
                    className="btn-secondary p-2"
                    title="Copy room link"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-vibe-gray-light mb-1">Share this link</label>
                <div className="text-xs text-vibe-gray-light break-all bg-vibe-darker p-2 rounded">
                  {`${typeof window !== 'undefined' ? window.location.origin : ''}/room/${roomId}`}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowRoomInfo(false)}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-vibe-dark/90 backdrop-blur-sm rounded-full px-6 py-4 shadow-2xl">
          <div className="flex items-center space-x-4">
            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              className={`control-button ${isAudioMuted ? 'danger' : 'active'}`}
              title={isAudioMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={onToggleVideo}
              className={`control-button ${isVideoMuted ? 'danger' : 'active'}`}
              title={isVideoMuted ? 'Turn on camera' : 'Turn off camera'}
            >
              {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            {/* Screen Share Toggle */}
            <button
              onClick={onToggleScreenShare}
              className={`control-button ${isScreenSharing ? 'active' : 'inactive'}`}
              title={isScreenSharing ? 'Stop screen sharing' : 'Share screen'}
            >
              {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </button>

            {/* Chat Toggle */}
            <button
              onClick={onToggleChat}
              className={`control-button ${isChatOpen ? 'active' : 'inactive'}`}
              title="Toggle chat"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Room Info */}
            <button
              onClick={() => setShowRoomInfo(true)}
              className="control-button inactive"
              title="Room information"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Leave Room */}
            <button
              onClick={onLeaveRoom}
              className="control-button danger"
              title="Leave room"
            >
              <Phone className="w-5 h-5 rotate-[135deg]" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
