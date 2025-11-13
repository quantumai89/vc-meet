const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000",
      "https://vc-meet.netlify.app",
      "https://vc-meet.vercel.app",
      "https://*.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage for rooms and users
const rooms = new Map();
const users = new Map();

// Helper functions
const createRoom = (roomId) => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      users: new Map(),
      createdAt: new Date(),
      messages: []
    });
  }
  return rooms.get(roomId);
};

const addUserToRoom = (roomId, userId, userName, socketId) => {
  const room = createRoom(roomId);
  const user = {
    id: userId,
    name: userName,
    socketId: socketId,
    isAudioMuted: false,
    isVideoMuted: false,
    isScreenSharing: false,
    joinedAt: new Date()
  };
  
  room.users.set(userId, user);
  users.set(socketId, { userId, roomId, userName });
  
  return user;
};

const removeUserFromRoom = (socketId) => {
  const userInfo = users.get(socketId);
  if (!userInfo) return null;
  
  const { userId, roomId } = userInfo;
  const room = rooms.get(roomId);
  
  if (room) {
    room.users.delete(userId);
    
    // Clean up empty rooms
    if (room.users.size === 0) {
      rooms.delete(roomId);
      console.log(`Room ${roomId} deleted - no users remaining`);
    }
  }
  
  users.delete(socketId);
  return { userId, roomId, userName: userInfo.userName };
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join room
  socket.on('join-room', ({ roomId, userName }) => {
    try {
      console.log(`Join room request: ${userName} -> ${roomId}`);
      const userId = uuidv4();
      const user = addUserToRoom(roomId, userId, userName, socket.id);
      
      socket.join(roomId);
      
      // Send current room users to the new user
      const room = rooms.get(roomId);
      const roomUsers = Array.from(room.users.values()).map(u => ({
        id: u.id,
        name: u.name,
        isAudioMuted: u.isAudioMuted,
        isVideoMuted: u.isVideoMuted,
        isScreenSharing: u.isScreenSharing
      }));
      
      console.log(`Sending room users to ${userName}:`, roomUsers.length, 'users');
      socket.emit('room-users', roomUsers);
      socket.emit('user-id', userId);
      
      // Notify others in the room
      socket.to(roomId).emit('user-joined', {
        id: user.id,
        name: user.name,
        isAudioMuted: user.isAudioMuted,
        isVideoMuted: user.isVideoMuted,
        isScreenSharing: user.isScreenSharing
      });
      
      // Send recent chat messages
      if (room.messages.length > 0) {
        socket.emit('chat-history', room.messages.slice(-50)); // Last 50 messages
      }
      
      console.log(`✅ User ${userName} (${userId}) joined room ${roomId}. Total users: ${room.users.size}`);
    } catch (error) {
      console.error('❌ Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Leave room
  socket.on('leave-room', () => {
    const userInfo = removeUserFromRoom(socket.id);
    if (userInfo) {
      socket.to(userInfo.roomId).emit('user-left', userInfo.userId);
      socket.leave(userInfo.roomId);
      console.log(`User ${userInfo.userName} left room ${userInfo.roomId}`);
    }
  });

  // WebRTC signaling
  socket.on('webrtc-offer', ({ offer, to }) => {
    const userInfo = users.get(socket.id);
    if (userInfo) {
      const targetUser = Array.from(users.entries())
        .find(([_, info]) => info.userId === to);
      
      if (targetUser) {
        io.to(targetUser[0]).emit('webrtc-offer', {
          offer,
          from: userInfo.userId
        });
      }
    }
  });

  socket.on('webrtc-answer', ({ answer, to }) => {
    const userInfo = users.get(socket.id);
    if (userInfo) {
      const targetUser = Array.from(users.entries())
        .find(([_, info]) => info.userId === to);
      
      if (targetUser) {
        io.to(targetUser[0]).emit('webrtc-answer', {
          answer,
          from: userInfo.userId
        });
      }
    }
  });

  socket.on('webrtc-ice-candidate', ({ candidate, to }) => {
    const userInfo = users.get(socket.id);
    if (userInfo) {
      const targetUser = Array.from(users.entries())
        .find(([_, info]) => info.userId === to);
      
      if (targetUser) {
        io.to(targetUser[0]).emit('webrtc-ice-candidate', {
          candidate,
          from: userInfo.userId
        });
      }
    }
  });

  // Media controls
  socket.on('toggle-audio', ({ isAudioMuted }) => {
    const userInfo = users.get(socket.id);
    if (userInfo) {
      const room = rooms.get(userInfo.roomId);
      const user = room?.users.get(userInfo.userId);
      if (user) {
        user.isAudioMuted = isAudioMuted;
        socket.to(userInfo.roomId).emit('user-audio-toggled', {
          userId: userInfo.userId,
          isAudioMuted
        });
      }
    }
  });

  socket.on('toggle-video', ({ isVideoMuted }) => {
    const userInfo = users.get(socket.id);
    if (userInfo) {
      const room = rooms.get(userInfo.roomId);
      const user = room?.users.get(userInfo.userId);
      if (user) {
        user.isVideoMuted = isVideoMuted;
        socket.to(userInfo.roomId).emit('user-video-toggled', {
          userId: userInfo.userId,
          isVideoMuted
        });
      }
    }
  });

  socket.on('toggle-screen-share', ({ isScreenSharing }) => {
    const userInfo = users.get(socket.id);
    if (userInfo) {
      const room = rooms.get(userInfo.roomId);
      const user = room?.users.get(userInfo.userId);
      if (user) {
        user.isScreenSharing = isScreenSharing;
        socket.to(userInfo.roomId).emit('user-screen-share-toggled', {
          userId: userInfo.userId,
          isScreenSharing
        });
      }
    }
  });

  // Chat messages
  socket.on('chat-message', ({ message }) => {
    const userInfo = users.get(socket.id);
    if (userInfo && message.trim()) {
      const chatMessage = {
        id: uuidv4(),
        userId: userInfo.userId,
        userName: userInfo.userName,
        message: message.trim(),
        timestamp: new Date(),
        type: 'text'
      };
      
      const room = rooms.get(userInfo.roomId);
      if (room) {
        room.messages.push(chatMessage);
        
        // Keep only last 100 messages to prevent memory issues
        if (room.messages.length > 100) {
          room.messages = room.messages.slice(-100);
        }
      }
      
      io.to(userInfo.roomId).emit('new-chat-message', chatMessage);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    const userInfo = removeUserFromRoom(socket.id);
    if (userInfo) {
      socket.to(userInfo.roomId).emit('user-left', userInfo.userId);
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    rooms: rooms.size, 
    users: users.size,
    timestamp: new Date().toISOString()
  });
});

// Get room info endpoint
app.get('/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  
  if (room) {
    res.json({
      id: room.id,
      userCount: room.users.size,
      createdAt: room.createdAt
    });
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 VibeCall signaling server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for connections`);
});
