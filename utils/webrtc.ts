export class WebRTCManager {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private socket: any = null;
  private userId: string = '';

  // STUN servers for NAT traversal
  private iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ];

  constructor(socket: any, userId: string) {
    this.socket = socket;
    this.userId = userId;
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('webrtc-offer', this.handleOffer.bind(this));
    this.socket.on('webrtc-answer', this.handleAnswer.bind(this));
    this.socket.on('webrtc-ice-candidate', this.handleIceCandidate.bind(this));
    this.socket.on('user-left', this.handleUserLeft.bind(this));
  }

  async initializeLocalStream(video: boolean = true, audio: boolean = true): Promise<MediaStream> {
    try {
      const constraints = {
        video: video ? {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        } : false,
        audio: audio ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      };

      console.log('Requesting media with constraints:', constraints);
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Local stream initialized:', this.localStream.getTracks().length, 'tracks');
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      
      // Try fallback with lower quality
      if (video && audio) {
        console.log('Trying fallback: audio only');
        try {
          this.localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          return this.localStream;
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }
      
      throw error;
    }
  }

  async createPeerConnection(remoteUserId: string): Promise<RTCPeerConnection> {
    const peerConnection = new RTCPeerConnection({
      iceServers: this.iceServers
    });

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('webrtc-ice-candidate', {
          candidate: event.candidate,
          to: remoteUserId
        });
      }
    };

    // Handle remote streams
    peerConnection.ontrack = (event) => {
      console.log(`Received remote stream from ${remoteUserId}`);
      // Remote stream will be handled by getRemoteStreams method
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log(`Connection state with ${remoteUserId}:`, peerConnection.connectionState);
    };

    this.peerConnections.set(remoteUserId, peerConnection);
    return peerConnection;
  }

  async createOffer(remoteUserId: string): Promise<void> {
    try {
      const peerConnection = await this.createPeerConnection(remoteUserId);
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      this.socket.emit('webrtc-offer', {
        offer,
        to: remoteUserId
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  private async handleOffer({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) {
    try {
      const peerConnection = await this.createPeerConnection(from);
      await peerConnection.setRemoteDescription(offer);
      
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      this.socket.emit('webrtc-answer', {
        answer,
        to: from
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  private async handleAnswer({ answer, from }: { answer: RTCSessionDescriptionInit; from: string }) {
    try {
      const peerConnection = this.peerConnections.get(from);
      if (peerConnection) {
        await peerConnection.setRemoteDescription(answer);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }

  private async handleIceCandidate({ candidate, from }: { candidate: RTCIceCandidateInit; from: string }) {
    try {
      const peerConnection = this.peerConnections.get(from);
      if (peerConnection) {
        await peerConnection.addIceCandidate(candidate);
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }

  private handleUserLeft(userId: string) {
    const peerConnection = this.peerConnections.get(userId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(userId);
    }
  }

  async toggleAudio(): Promise<boolean> {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return !audioTrack.enabled; // Return muted state
      }
    }
    return false;
  }

  async toggleVideo(): Promise<boolean> {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return !videoTrack.enabled; // Return muted state
      }
    }
    return false;
  }

  async startScreenShare(): Promise<MediaStream | null> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0];
      if (videoTrack) {
        this.peerConnections.forEach(async (peerConnection) => {
          const sender = peerConnection.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
        });

        // Handle screen share end
        videoTrack.onended = () => {
          this.stopScreenShare();
        };
      }

      return screenStream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      return null;
    }
  }

  async stopScreenShare(): Promise<void> {
    try {
      // Get camera stream back
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      const videoTrack = cameraStream.getVideoTracks()[0];
      if (videoTrack) {
        // Replace screen share track with camera track
        this.peerConnections.forEach(async (peerConnection) => {
          const sender = peerConnection.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
        });

        // Update local stream
        if (this.localStream) {
          const oldVideoTrack = this.localStream.getVideoTracks()[0];
          if (oldVideoTrack) {
            this.localStream.removeTrack(oldVideoTrack);
            oldVideoTrack.stop();
          }
          this.localStream.addTrack(videoTrack);
        }
      }
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  }

  getRemoteStreams(): Map<string, MediaStream> {
    const remoteStreams = new Map<string, MediaStream>();
    
    this.peerConnections.forEach((peerConnection, userId) => {
      const remoteStream = new MediaStream();
      peerConnection.getReceivers().forEach(receiver => {
        if (receiver.track) {
          remoteStream.addTrack(receiver.track);
        }
      });
      if (remoteStream.getTracks().length > 0) {
        remoteStreams.set(userId, remoteStream);
      }
    });

    return remoteStreams;
  }

  cleanup() {
    // Close all peer connections
    this.peerConnections.forEach(peerConnection => {
      peerConnection.close();
    });
    this.peerConnections.clear();

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }

    // Remove socket listeners
    this.socket.off('webrtc-offer');
    this.socket.off('webrtc-answer');
    this.socket.off('webrtc-ice-candidate');
    this.socket.off('user-left');
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getPeerConnections(): Map<string, RTCPeerConnection> {
    return this.peerConnections;
  }
}
