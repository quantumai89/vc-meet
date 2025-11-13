# 🎥 VibeCall - Free Video Calling App

**Talk Freely. Instantly. Globally.**

VibeCall is a modern, free alternative to Zoom built with cutting-edge web technologies. No sign-up required, no cost, just instant video meetings.

## ✨ Features

- 🚀 **Instant Meetings** - Create or join rooms in seconds
- 🎥 **HD Video & Audio** - Crystal clear peer-to-peer communication
- 💬 **Real-time Chat** - Built-in messaging system
- 🖥️ **Screen Sharing** - Share your screen with one click
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations
- 📱 **PWA Support** - Install as a native app
- 🔒 **Secure** - Peer-to-peer encryption via WebRTC
- 🌐 **No Sign-up** - Just enter your name and start calling

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **WebRTC** - Peer-to-peer video/audio
- **Socket.io Client** - Real-time communication
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express** - Web server framework
- **Socket.io** - WebSocket server for signaling
- **UUID** - Unique room ID generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibecall
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Start the signaling server**
   ```bash
   npm run server:dev
   ```
   Server will run on `http://localhost:3001`

5. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   App will run on `http://localhost:3000`

### Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start production servers**
   ```bash
   # Start signaling server
   npm run server

   # Start frontend (in new terminal)
   npm start
   ```

## 📁 Project Structure

```
vibecall/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── room/[roomId]/    # Dynamic room pages
├── components/            # React components
│   ├── VideoTile.tsx     # Video participant tile
│   ├── ControlBar.tsx    # Meeting controls
│   └── ChatPanel.tsx     # Chat sidebar
├── hooks/                # Custom React hooks
│   ├── useSocket.ts      # Socket.io management
│   └── useWebRTC.ts      # WebRTC peer connections
├── utils/                # Utility functions
│   ├── socket.ts         # Socket manager
│   └── webrtc.ts         # WebRTC manager
├── types/                # TypeScript type definitions
├── server/               # Backend signaling server
│   ├── index.js          # Express + Socket.io server
│   └── package.json      # Server dependencies
└── public/               # Static assets
    └── manifest.json     # PWA manifest
```

## 🎯 How It Works

1. **Room Creation**: Generate unique room ID and shareable link
2. **WebRTC Signaling**: Socket.io server facilitates peer discovery
3. **Peer Connection**: Direct browser-to-browser video/audio streams
4. **Real-time Chat**: Socket.io handles instant messaging
5. **Screen Sharing**: Native browser APIs for desktop sharing

## 🌐 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variable: `NEXT_PUBLIC_SOCKET_URL=https://your-server-url`
3. Deploy automatically on push

### Backend (Render/Railway/Heroku)
1. Deploy the `server/` directory
2. Set `PORT` environment variable
3. Update frontend `NEXT_PUBLIC_SOCKET_URL` to your server URL

### Environment Variables

**Frontend (.env.local)**
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

**Backend**
```env
PORT=3001
CLIENT_URL=http://localhost:3000
```

## 🔧 Development

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Backend
npm run server       # Start production server
npm run server:dev   # Start development server with nodemon
```

### Code Style
- ESLint + Prettier for consistent formatting
- TypeScript strict mode enabled
- Tailwind CSS for styling
- Component-based architecture

## 🎨 Customization

### Theming
Edit `tailwind.config.js` to customize colors:
```js
theme: {
  extend: {
    colors: {
      'vibe-dark': '#0f0f23',      // Background
      'vibe-blue': '#3b82f6',      // Primary accent
      // ... more colors
    }
  }
}
```

### Features
- Add recording functionality
- Implement virtual backgrounds
- Add emoji reactions
- Create waiting rooms

## 🐛 Troubleshooting

### Common Issues

**Camera/Microphone not working**
- Check browser permissions
- Ensure HTTPS in production
- Test with different browsers

**Connection issues**
- Verify server is running
- Check firewall settings
- Ensure WebRTC isn't blocked

**Audio echo**
- Local video is automatically muted
- Use headphones for better experience

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- WebRTC community for excellent documentation
- Socket.io team for real-time communication
- Next.js team for the amazing framework
- Tailwind CSS for beautiful styling

---

**Made with ❤️ for seamless communication**

*VibeCall - Because every conversation matters* 🎉
