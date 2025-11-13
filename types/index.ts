export interface User {
  id: string;
  name: string;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
}

export interface Room {
  id: string;
  users: User[];
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'emoji' | 'system';
}

export interface WebRTCSignal {
  type: 'offer' | 'answer' | 'ice-candidate';
  data: any;
  from: string;
  to: string;
}

export interface SocketEvents {
  // Room events
  'join-room': (data: { roomId: string; userName: string }) => void;
  'leave-room': (data: { roomId: string; userId: string }) => void;
  'room-users': (users: User[]) => void;
  'user-joined': (user: User) => void;
  'user-left': (userId: string) => void;
  
  // WebRTC signaling
  'webrtc-signal': (signal: WebRTCSignal) => void;
  'webrtc-offer': (data: { offer: RTCSessionDescriptionInit; from: string }) => void;
  'webrtc-answer': (data: { answer: RTCSessionDescriptionInit; from: string }) => void;
  'webrtc-ice-candidate': (data: { candidate: RTCIceCandidateInit; from: string }) => void;
  
  // Media controls
  'toggle-audio': (data: { userId: string; isAudioMuted: boolean }) => void;
  'toggle-video': (data: { userId: string; isVideoMuted: boolean }) => void;
  'toggle-screen-share': (data: { userId: string; isScreenSharing: boolean }) => void;
  
  // Chat
  'chat-message': (message: ChatMessage) => void;
  'new-chat-message': (message: ChatMessage) => void;
}

export interface MediaDevices {
  audioInputs: MediaDeviceInfo[];
  videoInputs: MediaDeviceInfo[];
  audioOutputs: MediaDeviceInfo[];
}

export interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error?: string;
}
