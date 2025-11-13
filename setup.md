# 🚀 VibeCall Setup Guide

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..
```

### 2. Start Development Servers

**Terminal 1 - Backend Server:**
```bash
npm run server:dev
```
Server runs on: http://localhost:3001

**Terminal 2 - Frontend App:**
```bash
npm run dev
```
App runs on: http://localhost:3000

### 3. Test the App
1. Open http://localhost:3000
2. Enter your name
3. Click "Create Meeting"
4. Open another browser tab/window
5. Join the same room with a different name
6. Test video, audio, chat, and screen sharing!

## Production Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable:
   - `NEXT_PUBLIC_SOCKET_URL=https://your-server-url`
4. Deploy!

### Backend (Render)
1. Create new Web Service on Render
2. Connect your repository
3. Set root directory to `server`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables:
   - `CLIENT_URL=https://your-frontend-url.vercel.app`
   - `PORT=10000`

## Environment Variables

Create `.env.local` in root directory:
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Troubleshooting

**Camera/Mic not working?**
- Check browser permissions
- Use HTTPS in production
- Try different browser

**Connection issues?**
- Ensure both servers are running
- Check firewall settings
- Verify environment variables

**Build errors?**
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`
- Check Node.js version (18+)

## Features Included ✅

- ✅ Instant room creation/joining
- ✅ HD video & audio calling
- ✅ Real-time chat messaging
- ✅ Screen sharing
- ✅ Responsive design
- ✅ PWA support
- ✅ Dark theme UI
- ✅ No sign-up required
- ✅ Peer-to-peer encryption

Ready to make some calls! 🎉
