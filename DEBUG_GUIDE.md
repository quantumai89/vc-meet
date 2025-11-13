# 🐛 VibeCall Debug Guide

## 🔍 Current Issues & Fixes Applied

### ✅ Fixed Issues

1. **WebRTC Remote Streams Missing**
   - **Problem**: Users couldn't see each other's video
   - **Fix**: Added `ontrack` event handler to receive remote streams
   - **Location**: `utils/webrtc.ts` line 72-76

2. **Metadata Viewport Warning**
   - **Problem**: Next.js warning about deprecated viewport in metadata
   - **Fix**: Moved viewport to separate export
   - **Location**: `app/layout.tsx` line 20-23

3. **Missing PWA Icons (404 errors)**
   - **Problem**: Browser requesting non-existent icon files
   - **Fix**: Created placeholder icon files
   - **Location**: `public/icon-192.png`, `public/icon-512.png`

4. **Insufficient Error Handling**
   - **Problem**: Media access failures crashed the app
   - **Fix**: Added fallback to audio-only mode
   - **Location**: `utils/webrtc.ts` line 50-58

5. **Poor Connection Debugging**
   - **Problem**: Hard to troubleshoot connection issues
   - **Fix**: Added comprehensive logging
   - **Location**: Multiple files with console.log statements

## 🧪 Testing Join Meeting Feature

### Manual Test Steps

1. **Open Browser Tab 1**
   ```
   http://localhost:3000
   ```
   - Enter name: "User 1"
   - Click "Create Meeting"
   - Note the room ID (e.g., "abc12345")

2. **Open Browser Tab 2**
   ```
   http://localhost:3000
   ```
   - Enter name: "User 2"
   - Enter room ID: "abc12345"
   - Click "Join Meeting"

3. **Expected Results**
   - Both users should see each other's video
   - Participant count shows "2 participants"
   - Chat works between users
   - Audio/video controls work

### Debug Console Commands

Open browser DevTools (F12) and check:

```javascript
// Check socket connection
window.socket?.connected

// Check local stream
window.localStream?.getTracks()

// Check remote streams
window.remoteStreams?.size

// Check WebRTC connections
window.peerConnections?.size
```

## 🔧 Common Issues & Solutions

### Issue 1: "Join Meeting" Button Not Working
**Symptoms**: Button click doesn't navigate to room
**Debug Steps**:
1. Check browser console for errors
2. Verify form validation (name and room ID required)
3. Check network tab for navigation requests

**Solution**: Ensure both name and room ID are filled

### Issue 2: Users Can't See Each Other
**Symptoms**: Only local video visible, no remote videos
**Debug Steps**:
1. Check server logs for "user-joined" events
2. Check browser console for WebRTC errors
3. Verify camera/microphone permissions

**Solution**: 
- Grant camera permissions
- Check STUN server connectivity
- Verify WebRTC peer connections

### Issue 3: Connection Stuck on "Connecting..."
**Symptoms**: Loading screen doesn't disappear
**Debug Steps**:
1. Check socket connection status
2. Verify server is running on port 3001
3. Check for CORS errors

**Solution**:
- Restart servers
- Check environment variables
- Verify firewall settings

### Issue 4: Chat Not Working
**Symptoms**: Messages don't send or receive
**Debug Steps**:
1. Check socket events in network tab
2. Verify room joining was successful
3. Check server logs for message events

**Solution**: Ensure socket connection is established

## 📊 Server Health Check

### Check Server Status
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "rooms": 0,
  "users": 0,
  "timestamp": "2025-01-14T19:52:00.000Z"
}
```

### Monitor Server Logs
Watch for these key events:
- `User connected: [socket-id]`
- `Join room request: [user] -> [room]`
- `✅ User [name] joined room [id]. Total users: [count]`
- `WebRTC signaling events`

## 🚀 Performance Optimization

### Browser Requirements
- Chrome 80+ (recommended)
- Firefox 75+
- Safari 14+
- Edge 80+

### Network Requirements
- Stable internet connection
- WebRTC-friendly firewall
- STUN server access

### System Requirements
- Camera and microphone access
- Modern browser with WebRTC support
- JavaScript enabled

## 🔄 Restart Procedure

If issues persist, follow this restart sequence:

1. **Stop Servers**
   ```bash
   # Kill both dev servers (Ctrl+C)
   ```

2. **Clear Cache**
   ```bash
   rm -rf .next
   npm run build
   ```

3. **Restart Backend**
   ```bash
   npm run server:dev
   ```

4. **Restart Frontend**
   ```bash
   npm run dev
   ```

5. **Clear Browser Cache**
   - Hard refresh (Ctrl+Shift+R)
   - Clear site data in DevTools

## 📞 Test Scenarios

### Scenario 1: Basic Join
- User A creates room
- User B joins with room ID
- Both see each other ✅

### Scenario 2: Multiple Users
- User A creates room
- User B joins
- User C joins same room
- All three see each other ✅

### Scenario 3: Late Join
- User A creates room, waits
- User B joins 5 minutes later
- Connection establishes properly ✅

### Scenario 4: Reconnection
- User temporarily loses internet
- Reconnects automatically
- Video/audio resumes ✅

## 🎯 Success Criteria

**Join Meeting is working if**:
- ✅ Room navigation works
- ✅ Socket connection establishes
- ✅ WebRTC peer connections form
- ✅ Video/audio streams flow
- ✅ Chat messages sync
- ✅ Controls function properly

## 🚨 Emergency Fixes

### Quick Fix 1: Reset Everything
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Quick Fix 2: Bypass WebRTC
Temporarily disable video for audio-only testing:
```javascript
// In utils/webrtc.ts
video: false // Set to false for debugging
```

### Quick Fix 3: Server Reset
```bash
# Kill all node processes
pkill -f node
# Restart servers
npm run server:dev &
npm run dev
```

---

**Debug Status**: All major issues identified and fixed ✅
**Next Step**: Deploy to production 🚀
