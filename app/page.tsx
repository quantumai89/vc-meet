'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Users, ArrowRight, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  const createMeeting = () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    const newRoomId = uuidv4().slice(0, 8);
    router.push(`/room/${newRoomId}?name=${encodeURIComponent(userName.trim())}`);
  };

  const joinMeeting = () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!roomId.trim()) {
      alert('Please enter a room ID');
      return;
    }
    
    setIsJoining(true);
    router.push(`/room/${roomId.trim()}?name=${encodeURIComponent(userName.trim())}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Video className="w-16 h-16 text-vibe-blue pulse-glow" />
              <Sparkles className="w-6 h-6 text-vibe-blue-light absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Vibe<span className="text-vibe-blue">Call</span>
          </h1>
          <p className="text-vibe-gray-light text-lg">
            Talk Freely. Instantly. Globally.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-vibe-dark p-8 rounded-2xl shadow-2xl space-y-6">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="input-field w-full"
              maxLength={50}
            />
          </div>

          <div className="space-y-4">
            {/* Create Meeting */}
            <button
              onClick={createMeeting}
              className="btn-primary w-full flex items-center justify-center space-x-3"
              disabled={!userName.trim()}
            >
              <Video className="w-5 h-5" />
              <span>Create Meeting</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-vibe-gray"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-vibe-dark text-vibe-gray-light">or</span>
              </div>
            </div>

            {/* Join Meeting */}
            <div className="space-y-3">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="input-field w-full"
                maxLength={20}
              />
              <button
                onClick={joinMeeting}
                className="btn-secondary w-full flex items-center justify-center space-x-3"
                disabled={!userName.trim() || !roomId.trim() || isJoining}
              >
                <Users className="w-5 h-5" />
                <span>{isJoining ? 'Joining...' : 'Join Meeting'}</span>
                {!isJoining && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-white">Why VibeCall?</h2>
          <div className="grid grid-cols-1 gap-3 text-sm text-vibe-gray-light">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-vibe-blue rounded-full"></div>
              <span>No sign-up required</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-vibe-blue rounded-full"></div>
              <span>Completely free forever</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-vibe-blue rounded-full"></div>
              <span>Secure peer-to-peer connection</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-vibe-blue rounded-full"></div>
              <span>Works on any device</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-vibe-gray-light">
          <p>Made with ❤️ for seamless communication</p>
        </div>
      </div>
    </div>
  );
}
