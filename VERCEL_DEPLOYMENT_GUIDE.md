# Vercel Deployment Guide for Admin Override

## Overview
This guide explains how to deploy the changes to Vercel so the admin premium override works correctly.

## Project Structure

Your project has:
- **Frontend (Client)**: React + Vite → Deploy to Vercel
- **Backend (Server)**: Express.js → Deploy to Render (or another hosting service)

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket**: Your code must be in a Git repository
3. **Vercel CLI** (optional but recommended):
   ```bash
   npm i -g vercel
   ```

---

## Step 1: Push Code to Git

Before deploying, commit all your changes:

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "Add admin premium override feature"

# Push to your repository
git push origin main  # or your branch name
```

---

## Step 2: Deploy Frontend to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import your Git repository
   - Select the repository

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client` (IMPORTANT!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variables**:
   
   **CRITICAL**: Add these environment variables in Vercel:
   
   ```
   VITE_ADMIN_EMAIL=codrix.solutions@gmail.com
   VITE_BASE_URL=https://your-backend-url.onrender.com
   VITE_FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
   
   **How to add:**
   - In project settings → Environment Variables
   - Add each variable for:
     - Production ✅
     - Preview ✅
     - Development ✅ (if needed)
   - Click "Save"

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

### Option B: Via Vercel CLI

1. **Navigate to client directory**:
   ```bash
   cd client
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set environment variables**:
   ```bash
   vercel env add VITE_ADMIN_EMAIL
   # Enter: codrix.solutions@gmail.com
   
   vercel env add VITE_BASE_URL
   # Enter: https://your-backend-url.onrender.com
   
   vercel env add VITE_FRONTEND_URL
   # Enter: https://your-vercel-app.vercel.app
   ```

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

---

## Step 3: Configure Backend Environment Variables

Since your backend is on Render (based on code comments), you need to set backend environment variables there:

### On Render Dashboard:

1. Go to your Render service dashboard
2. Navigate to "Environment" section
3. Add these variables:

```
ADMIN_EMAIL=codrix.solutions@gmail.com
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
OPENAI_BASE_URL=your_openai_base_url
OPENAI_MODEL=your_model_name
IMAGEKIT_PRIVATE_KEY=your_imagekit_key
FRONTEND_URL=https://your-vercel-app.vercel.app
```

4. **Restart the service** after adding variables

---

## Step 4: Verify Deployment

### Test Admin Override:

1. **Visit your Vercel URL**: `https://your-app.vercel.app`

2. **Login with admin email**:
   - Use: `codrix.solutions@gmail.com`
   - The admin email must match exactly (case-insensitive)

3. **Verify premium features work**:
   - ✅ ATS Score should be accessible
   - ✅ Job Tailoring toggle should be enabled
   - ✅ Export should have no watermark

4. **Verify debug indicator (development only)**:
   - The "Premium Active (Admin)" badge won't show in production
   - This is expected behavior

5. **Test with regular user**:
   - Login with non-admin email
   - Premium features should be locked
   - Upgrade prompts should appear

---

## Step 5: Update API Configuration (If Needed)

If your backend URL changes, update `client/src/configs/api.js`:

```javascript
const baseURL = import.meta.env.VITE_BASE_URL || 'https://your-backend.onrender.com'
```

The `VITE_BASE_URL` environment variable will override the default.

---

## Environment Variables Summary

### Frontend (Vercel) - Required:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_ADMIN_EMAIL` | `codrix.solutions@gmail.com` | Admin email for premium override |
| `VITE_BASE_URL` | `https://your-backend.onrender.com` | Backend API URL |
| `VITE_FRONTEND_URL` | `https://your-vercel-app.vercel.app` | Frontend URL (for redirects) |

### Backend (Render) - Required:

| Variable | Value | Description |
|----------|-------|-------------|
| `ADMIN_EMAIL` | `codrix.solutions@gmail.com` | Admin email for premium override |
| `MONGODB_URI` | `mongodb://...` | MongoDB connection string |
| `JWT_SECRET` | `your-secret` | JWT signing secret |
| `FRONTEND_URL` | `https://your-vercel-app.vercel.app` | Frontend URL for CORS |

---

## Important Notes

### ✅ Do's:

- **Always set `VITE_ADMIN_EMAIL`** in Vercel environment variables
- **Always set `ADMIN_EMAIL`** in Render environment variables
- **Keep both values identical** (frontend and backend must match)
- **Use production environment variables** (not development)
- **Restart services** after adding environment variables

### ❌ Don'ts:

- **Don't hardcode** admin email in code
- **Don't commit** `.env` files to Git
- **Don't use different emails** in frontend and backend
- **Don't forget to restart** backend after environment variable changes

---

## Troubleshooting

### Admin Override Not Working?

1. **Check environment variables**:
   ```bash
   # In Vercel, verify VITE_ADMIN_EMAIL is set
   # In Render, verify ADMIN_EMAIL is set
   ```

2. **Check email matches exactly**:
   - Case-insensitive, but must match character-for-character
   - No extra spaces

3. **Check backend logs**:
   - Render dashboard → Logs
   - Look for any errors related to admin check

4. **Check user object**:
   - In browser DevTools → Network → User response
   - Should see `isPremium: true` and `isAdmin: true` for admin users

5. **Clear browser cache**:
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Debug Indicator Showing in Production?

- The debug indicator only shows in development mode
- In production (`npm run build`), `import.meta.env.DEV === false`
- This is expected and correct behavior

### CORS Errors?

- Make sure `FRONTEND_URL` in backend matches your Vercel URL
- Check `server.js` CORS configuration includes your Vercel domain

---

## Quick Deploy Checklist

- [ ] Code pushed to Git repository
- [ ] Frontend deployed to Vercel
- [ ] `VITE_ADMIN_EMAIL` set in Vercel
- [ ] `VITE_BASE_URL` set in Vercel
- [ ] Backend deployed to Render
- [ ] `ADMIN_EMAIL` set in Render
- [ ] Backend service restarted
- [ ] Tested login with admin email
- [ ] Verified premium features work
- [ ] Tested with regular user (features locked)

---

## Vercel Configuration File (Optional)

If you want more control, create `vercel.json` in the **root** of your repository:

```json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "framework": "vite",
  "installCommand": "cd client && npm install",
  "env": {
    "VITE_ADMIN_EMAIL": "codrix.solutions@gmail.com"
  }
}
```

However, **it's better to set environment variables in Vercel dashboard** rather than in `vercel.json` for security.

---

## Next Steps

After successful deployment:

1. ✅ Test all premium features with admin account
2. ✅ Test regular user restrictions
3. ✅ Remove debug indicator code (if desired)
4. ✅ Monitor logs for any issues
5. ✅ Set up monitoring/alerts (optional)

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Render backend logs
3. Verify environment variables are set correctly
4. Test admin email login locally first
5. Check browser console for frontend errors
