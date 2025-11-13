# 🚀 GitHub Repository Setup & Deployment

## 📋 **STEP 1: Create GitHub Repository**

### **Option A: Create via GitHub Website**
1. Go to https://github.com/kirtanPandya93
2. Click "New Repository" (green button)
3. Repository name: `video-meet-striker`
4. Description: `VibeCall - Free Video Calling App (Zoom Alternative)`
5. Set to **Public** (for free deployment)
6. **DON'T** initialize with README (we have our own)
7. Click "Create Repository"

### **Option B: Create via GitHub CLI** (if installed)
```bash
gh repo create kirtanPandya93/video-meet-striker --public --description "VibeCall - Free Video Calling App"
```

---

## 📋 **STEP 2: Push Code to GitHub**

After creating the repository, run these commands:

```bash
# Remove old remote (if any)
git remote remove origin

# Add your new repository
git remote add origin https://github.com/kirtanPandya93/video-meet-striker.git

# Push to GitHub
git push -u origin main
```

---

## 📋 **STEP 3: Deploy to Production**

### **Backend Deployment (Render)**
1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository: `kirtanPandya93/video-meet-striker`
5. Configure:
   - **Name**: `video-meet-striker-server`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   CLIENT_URL=https://video-meet-striker.vercel.app
   ```

7. Click "Create Web Service"
8. Wait for deployment (3-5 minutes)
9. Note your backend URL: `https://video-meet-striker-server.onrender.com`

### **Frontend Deployment (Vercel)**
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import repository: `kirtanPandya93/video-meet-striker`
5. Configure:
   - **Framework**: Next.js (auto-detected)
   - **Project Name**: `video-meet-striker`
   - **Root Directory**: `./` (default)

6. **Environment Variables**:
   ```
   NEXT_PUBLIC_SOCKET_URL=https://video-meet-striker-server.onrender.com
   ```

7. Click "Deploy"
8. Wait for deployment (2-3 minutes)
9. Your app will be live at: `https://video-meet-striker.vercel.app`

---

## 📋 **STEP 4: Update CORS Settings**

After getting your Vercel URL, update the backend CORS:

1. Edit `server/index.js` in GitHub
2. Update the CORS origin:
   ```javascript
   origin: [
     "https://video-meet-striker.vercel.app",
     "https://*.vercel.app",
     process.env.CLIENT_URL || "http://localhost:3000"
   ]
   ```
3. Commit and push changes
4. Render will auto-redeploy

---

## 📋 **STEP 5: Test Your Live App**

Visit your live URLs:
- **Frontend**: https://video-meet-striker.vercel.app
- **Backend Health**: https://video-meet-striker-server.onrender.com/health

Test all features:
- ✅ Create meeting
- ✅ Join meeting  
- ✅ Video/audio calling
- ✅ Real-time chat
- ✅ Screen sharing
- ✅ Mobile responsiveness

---

## 🎯 **Expected Live URLs**

After deployment, your app will be available at:

- **Main App**: `https://video-meet-striker.vercel.app`
- **Backend API**: `https://video-meet-striker-server.onrender.com`
- **Health Check**: `https://video-meet-striker-server.onrender.com/health`
- **GitHub Repo**: `https://github.com/kirtanPandya93/video-meet-striker`

---

## 🚀 **Quick Deploy Commands**

Once repository is created, run this to deploy:

```bash
# Push to GitHub
git remote add origin https://github.com/kirtanPandya93/video-meet-striker.git
git push -u origin main

# Then follow deployment steps above for Render + Vercel
```

---

## 🎉 **Success!**

Your VibeCall app will be live and accessible worldwide! 🌍

**Total deployment time**: ~10 minutes  
**Cost**: $0 (using free tiers)  
**Features**: Full Zoom alternative with video, audio, chat, screen sharing
