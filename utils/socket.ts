import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '@/types';

declare const process: {
  env: {
    NEXT_PUBLIC_SOCKET_URL?: string;
  };
};

class SocketManager {
  private socket: Socket | null = null;
  private static instance: SocketManager;

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(serverUrl?: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const url = serverUrl || process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    
    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    });

    this.socket.on('connect', () => {
      console.log('🔗 Connected to VibeCall server');
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('📡 Disconnected from server:', reason);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('❌ Connection error:', error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Typed event emitters
  emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export default SocketManager;
