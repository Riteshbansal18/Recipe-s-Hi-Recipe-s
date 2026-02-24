# 🚀 Netlify Deployment Setup

## ✅ Configuration Fixed

### Problem
Netlify root directory se build kar raha tha, but frontend alag folder mein hai.

### Solution
`netlify.toml` file root mein add ki with proper configuration:

```toml
[build]
  base = "frontend"          # Frontend folder se build karo
  command = "npm run build"  # Build command
  publish = "build"          # Build output folder
```

## 📋 Netlify Dashboard Settings

### Build Settings (Already configured via netlify.toml)
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `build`

### Environment Variables (Add in Netlify Dashboard)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

⚠️ **Important:** Backend URL ko apne actual backend URL se replace karo!

## 🔧 Manual Setup (If needed)

Agar netlify.toml se automatically configure nahi hua to:

1. Netlify Dashboard mein jao
2. Site Settings → Build & Deploy → Build Settings
3. Update karo:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`

## 🧪 Testing After Deployment

1. **Homepage:** Should load properly
2. **Routing:** Navigate to `/feed`, `/explore`, etc.
3. **Reload Test:** Press F5 on any page - should NOT show 404
4. **Images:** Should load from backend
5. **API Calls:** Check browser console for errors

## 🐛 Common Issues

### Issue 1: Build fails with "Missing script: build"
**Solution:** netlify.toml mein `base = "frontend"` set hai

### Issue 2: 404 on page reload
**Solution:** `[[redirects]]` section already configured in netlify.toml

### Issue 3: Environment variables not working
**Solution:** Netlify Dashboard → Site Settings → Environment Variables mein add karo

### Issue 4: Images not loading
**Solution:** 
- Backend properly deployed hai?
- REACT_APP_API_URL sahi set hai?
- Backend CORS allow kar raha hai?

## 📝 Deployment Checklist

- [x] netlify.toml created in root
- [x] Base directory set to "frontend"
- [x] Redirects configured for SPA routing
- [ ] Environment variables added in Netlify Dashboard
- [ ] Backend deployed and running
- [ ] REACT_APP_API_URL updated with backend URL

## 🔗 Useful Links

- Netlify Dashboard: https://app.netlify.com
- Build Logs: Check in Netlify Dashboard → Deploys
- Environment Variables: Site Settings → Environment Variables

## 💡 Pro Tips

1. **Auto Deploy:** GitHub se connect karo for automatic deployments
2. **Preview Deploys:** Pull requests automatically preview deploy honge
3. **Build Logs:** Agar error aaye to build logs check karo
4. **Cache Clear:** Agar purani build stuck hai to "Clear cache and retry deploy"

---

**Last Updated:** February 24, 2026
**Status:** ✅ Configuration complete, ready to deploy
