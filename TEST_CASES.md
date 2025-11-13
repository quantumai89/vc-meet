# 🧪 VibeCall Test Cases & Verification

## ✅ Pre-Flight Checklist

### 1. Server Status
- [ ] Backend server running on http://localhost:3001
- [ ] Frontend server running on http://localhost:3000
- [ ] No build errors in console
- [ ] Browser can access both URLs

### 2. Environment Setup
- [ ] Dependencies installed (`npm install` in root and server/)
- [ ] TypeScript compilation successful
- [ ] Tailwind CSS working (dark theme visible)

## 🎯 Core Functionality Tests

### A. Home Page Tests
**Test Case 1: Landing Page**
- [ ] Navigate to http://localhost:3000
- [ ] VibeCall logo and branding visible
- [ ] "Your Name" input field present
- [ ] "Create Meeting" button present
- [ ] "Join Meeting" section with room ID input
- [ ] Feature list displayed correctly

**Test Case 2: Form Validation**
- [ ] Try creating meeting without name → Should show alert
- [ ] Try joining without name → Should show alert
- [ ] Try joining without room ID → Should show alert
- [ ] Enter name → Buttons should become enabled

**Test Case 3: Room Creation**
- [ ] Enter name "Test User 1"
- [ ] Click "Create Meeting"
- [ ] Should redirect to `/room/[roomId]` URL
- [ ] Room ID should be 8 characters long

### B. Room Functionality Tests

**Test Case 4: Room Loading**
- [ ] Room page loads without errors
- [ ] "Connecting to room..." loading state shows
- [ ] Socket connection establishes
- [ ] Camera/microphone permissions requested
- [ ] Loading state disappears when ready

**Test Case 5: Video/Audio Setup**
- [ ] Local video tile appears
- [ ] User's camera feed visible (if permissions granted)
- [ ] "You" label on local video
- [ ] Audio/video status indicators show correctly
- [ ] Room info header shows room ID and participant count

**Test Case 6: Multi-User Connection**
- [ ] Open second browser tab/window
- [ ] Navigate to same room URL
- [ ] Enter different name "Test User 2"
- [ ] Second user should see first user's video
- [ ] First user should see second user join
- [ ] Participant count updates to "2 participants"

### C. Media Controls Tests

**Test Case 7: Audio Controls**
- [ ] Click microphone button
- [ ] Audio should mute/unmute
- [ ] Button color changes (red when muted)
- [ ] Other participants see audio status change
- [ ] Microphone icon updates correctly

**Test Case 8: Video Controls**
- [ ] Click camera button
- [ ] Video should turn on/off
- [ ] Button color changes (red when off)
- [ ] Other participants see video status change
- [ ] Video tile shows placeholder when off

**Test Case 9: Screen Sharing**
- [ ] Click screen share button
- [ ] Browser prompts for screen selection
- [ ] Select screen/window to share
- [ ] Screen content appears in video tile
- [ ] Other participants see shared screen
- [ ] Click again to stop sharing
- [ ] Returns to camera feed

### D. Chat System Tests

**Test Case 10: Chat Panel**
- [ ] Click chat button in control bar
- [ ] Chat panel slides in from right
- [ ] "No messages yet" placeholder shows
- [ ] Message input field at bottom
- [ ] Character counter shows (0/500)

**Test Case 11: Messaging**
- [ ] Type message "Hello from User 1"
- [ ] Press Enter or click Send
- [ ] Message appears in chat with timestamp
- [ ] Other participants receive message instantly
- [ ] Message shows sender name and time
- [ ] Input field clears after sending

**Test Case 12: Chat Features**
- [ ] Send multiple messages
- [ ] Chat auto-scrolls to bottom
- [ ] Long messages wrap correctly
- [ ] Emoji work in messages 😊
- [ ] Close chat panel with X button

### E. UI/UX Tests

**Test Case 13: Responsive Design**
- [ ] Resize browser window
- [ ] Video grid adapts to different sizes
- [ ] Chat panel works on mobile viewport
- [ ] Control bar remains accessible
- [ ] Text remains readable at all sizes

**Test Case 14: Dark Theme**
- [ ] All elements use dark theme colors
- [ ] Text is readable (white on dark)
- [ ] Buttons have proper hover states
- [ ] Icons are visible and clear
- [ ] No light theme elements visible

**Test Case 15: Animations**
- [ ] Hover effects on buttons work
- [ ] Loading spinner animates
- [ ] Chat panel slides smoothly
- [ ] Video tiles have smooth transitions
- [ ] Pulse effect on logo works

### F. Error Handling Tests

**Test Case 16: Connection Issues**
- [ ] Stop backend server
- [ ] Frontend should show connection error
- [ ] Restart server → Should reconnect
- [ ] No crashes or white screens

**Test Case 17: Permission Denied**
- [ ] Deny camera/microphone permissions
- [ ] App should handle gracefully
- [ ] Show appropriate error message
- [ ] Still allow joining room (audio-only)

**Test Case 18: Invalid Room**
- [ ] Navigate to `/room/invalid-room-id`
- [ ] Should handle gracefully
- [ ] No crashes or errors
- [ ] Can still create new room

### G. Performance Tests

**Test Case 19: Multiple Users**
- [ ] Test with 3-4 participants
- [ ] Video quality remains good
- [ ] Audio sync is maintained
- [ ] Chat remains responsive
- [ ] No significant lag

**Test Case 20: Extended Session**
- [ ] Keep room open for 10+ minutes
- [ ] Connection remains stable
- [ ] No memory leaks visible
- [ ] All features continue working

## 🚀 Advanced Feature Tests

### H. WebRTC Connectivity

**Test Case 21: Peer-to-Peer**
- [ ] Check browser dev tools → Network
- [ ] Video/audio should flow directly between browsers
- [ ] Server only handles signaling (Socket.io)
- [ ] STUN servers working for NAT traversal

**Test Case 22: Network Resilience**
- [ ] Temporarily disconnect internet
- [ ] Reconnect → Should restore connection
- [ ] No permanent connection loss
- [ ] Graceful reconnection handling

### I. PWA Features

**Test Case 23: Installation**
- [ ] Browser shows "Install App" prompt
- [ ] Install as PWA works
- [ ] App icon appears on desktop/home screen
- [ ] Runs in standalone mode

## 📊 Test Results Summary

### ✅ Passed Tests: ___/23
### ❌ Failed Tests: ___/23
### ⚠️ Issues Found: ___

## 🐛 Bug Report Template

**Bug #**: ___
**Test Case**: ___
**Description**: ___
**Steps to Reproduce**:
1. ___
2. ___
3. ___

**Expected Result**: ___
**Actual Result**: ___
**Browser**: ___
**Priority**: High/Medium/Low

## 🎉 Success Criteria

For VibeCall to be considered fully functional:
- [ ] All core features work (video, audio, chat, screen share)
- [ ] Multi-user connections stable
- [ ] No critical bugs or crashes
- [ ] UI/UX is polished and responsive
- [ ] Performance is acceptable (< 2s load time)
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari)

---

**Testing completed by**: ___________
**Date**: ___________
**Overall Status**: PASS / FAIL / NEEDS WORK
