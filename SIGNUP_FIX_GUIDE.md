# Sign-Up Fix Guide

## Issues Found

### ❌ Issue 1: CORS Configuration
Your backend CORS settings don't include your Vercel frontend URL, which blocks all API requests (including sign-up).

**Current CORS origins:**
```javascript
origin: [
    'https://resume-frontend-5pbi.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000'
]
```

**Missing:** `https://web-ai-resume-builder.vercel.app` (or your actual Vercel URL)

### ❌ Issue 2: Missing FRONTEND_URL in Render
The backend expects `FRONTEND_URL` environment variable but it's not set in your Render dashboard.

---

## Fix 1: Update Backend CORS (Code Change)

✅ **Already fixed in code** - `server/server.js` now includes:
- Your Vercel URL
- Support for `FRONTEND_URL` environment variable

**Next step:** Deploy this change to Render

---

## Fix 2: Add FRONTEND_URL to Render

1. **Go to Render Dashboard** → Your service → Environment tab
2. **Add new environment variable:**
   ```
   KEY: FRONTEND_URL
   VALUE: https://web-ai-resume-builder.vercel.app
   ```
   (Replace with your actual Vercel URL)

3. **Save and restart** your Render service

---

## Fix 3: Update CORS with Your Exact Vercel URL

If your Vercel URL is different, update `server/server.js`:

```javascript
origin: [
    'https://resume-frontend-5pbi.onrender.com',
    'https://web-ai-resume-builder.vercel.app', // ← Add your actual Vercel URL here
    process.env.FRONTEND_URL, // ← This will also work
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean), // Removes undefined values
```

---

## Quick Fix Checklist

### ✅ Backend (Render):

1. [ ] **Deploy updated code** with CORS fix
2. [ ] **Add FRONTEND_URL** environment variable:
   ```
   FRONTEND_URL=https://web-ai-resume-builder.vercel.app
   ```
3. [ ] **Restart service** after adding environment variable

### ✅ Verify Vercel URL:

Check your Vercel deployment URL:
- Should match what's in `VITE_FRONTEND_URL`
- Should be added to backend CORS origins

---

## Testing After Fix

1. **Try sign-up again** on Vercel frontend
2. **Check browser console** (F12) for CORS errors
3. **Check Network tab** for failed requests
4. **Verify**:
   - ✅ No CORS errors in console
   - ✅ Sign-up request completes
   - ✅ User is created successfully

---

## Common Error Messages

### Before Fix:
```
Access to XMLHttpRequest at 'https://web-ai-resume-builder.onrender.com/api/users/register' 
from origin 'https://web-ai-resume-builder.vercel.app' has been blocked by CORS policy
```

### After Fix:
✅ No CORS errors, sign-up works

---

## If Still Not Working

1. **Verify exact Vercel URL:**
   - Go to Vercel dashboard
   - Copy the exact production URL
   - Update CORS in `server/server.js`
   - Update `FRONTEND_URL` in Render

2. **Check backend logs:**
   - Render dashboard → Logs
   - Look for CORS or connection errors

3. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

4. **Check environment variables:**
   - Verify `FRONTEND_URL` is set in Render
   - Verify `VITE_BASE_URL` points to correct backend in Vercel
