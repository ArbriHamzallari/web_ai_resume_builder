# Vercel Deployment Guide

## Quick Fix Summary

The NOT_FOUND error occurs because Vercel expects serverless functions, not a traditional Express server. The fixes include:

1. **Created `/api/index.js`** - Serverless function wrapper
2. **Updated `vercel.json`** - Proper routing configuration
3. **Modified `server/configs/db.js`** - Connection pooling for serverless
4. **Updated `server/server.js`** - Works in both serverless and traditional modes

## Environment Variables Required

Make sure to set these in Vercel dashboard:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - For authentication
- `VITE_BASE_URL` - Frontend API base URL (e.g., `https://your-domain.vercel.app`)
- Any other environment variables your app needs

## Deployment Steps

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to project root (not client/)
4. Configure environment variables
5. Deploy

## Alternative: Separate Deployments

If you prefer, you can:
- Deploy frontend to Vercel
- Deploy backend to Railway/Render/Heroku separately
- Update `VITE_BASE_URL` to point to backend URL

