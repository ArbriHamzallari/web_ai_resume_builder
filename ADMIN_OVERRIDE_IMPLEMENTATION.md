# Admin Premium Override Implementation

## Overview
This implementation adds an admin premium override that grants premium access to users with a specified admin email, bypassing all payment and subscription checks. This works on both backend and frontend.

## Environment Variables Required

### Backend (`.env` in `server/` directory):
```env
ADMIN_EMAIL=codrix.solutions@gmail.com
```

### Frontend (`.env` in `client/` directory):
```env
VITE_ADMIN_EMAIL=codrix.solutions@gmail.com
```

**Note:** Vite requires the `VITE_` prefix for client-side environment variables to be exposed to the browser.

## Files Modified

### Backend Changes

1. **`server/utils/adminUtils.js`** (NEW FILE)
   - Contains `isAdminUser(userEmail)` - checks if email matches admin email
   - Contains `getEffectivePlan(user)` - returns premium plan for admins

2. **`server/controllers/userController.js`**
   - Updated `registerUser()` - sets premium plan for admin users on registration
   - Updated `loginUser()` - sets premium plan for admin users on login
   - Updated `getUserById()` - returns premium plan for admin users

### Frontend Changes

3. **`client/src/pricing/featureGate.js`**
   - Added `isAdminUser()` helper function
   - Updated `getUserPlan()` - checks admin email first before checking stored plan
   - Admin users always get `pro_monthly` plan regardless of stored plan

## How It Works

### Flow Diagram:
```
User Login/Registration
    ↓
Backend: Check if email === ADMIN_EMAIL
    ↓
If Admin:
    - Set user.plan = 'pro_monthly' in response
    - Set user.isAdmin = true (for debugging)
    ↓
Frontend: Store user in Redux state
    ↓
Feature Check: getUserPlan(authState)
    ↓
Check if email === VITE_ADMIN_EMAIL
    ↓
If Admin: Return 'pro_monthly'
Else: Return stored plan or 'free'
```

### Check Locations:

**Backend Checks:**
- ✅ User registration (`registerUser()`)
- ✅ User login (`loginUser()`)
- ✅ Get user data (`getUserById()`)

**Frontend Checks:**
- ✅ `getUserPlan()` in `featureGate.js` - Called by all feature checks
- ✅ `canAccessFeature()` - Uses `getUserPlan()` internally
- ✅ `canPerformAction()` - Uses `getUserPlan()` internally
- ✅ `canExportResume()` - Uses `getUserPlan()` internally

**Components Using Feature Checks:**
- ✅ `ATSScore.jsx` - Checks `canAccessFeature(authState, 'atsScore')`
- ✅ `JobTailoringToggle.jsx` - Checks `canAccessFeature(authState, 'jobTailoring')`
- ✅ `ResumeBuilder.jsx` - Checks `canExportResume(authState)`

## Features Granted to Admin

Admin users automatically get **PRO_MONTHLY** plan features:
- ✅ Unlimited resumes
- ✅ No watermark on exports
- ✅ ATS Score access
- ✅ Job-Specific Tailoring access
- ✅ Multiple export formats (PDF, DOCX)
- ✅ AI Assistance

## Testing Instructions

### 1. Setup Environment Variables

**Backend (`server/.env`):**
```env
ADMIN_EMAIL=codrix.solutions@gmail.com
```

**Frontend (`client/.env`):**
```env
VITE_ADMIN_EMAIL=codrix.solutions@gmail.com
```

### 2. Test with Admin Email

1. **Create/Login with Admin Email:**
   - Register or login with: `codrix.solutions@gmail.com`
   - Check browser DevTools → Network → Response
   - User object should have `plan: 'pro_monthly'` and `isAdmin: true`

2. **Test ATS Score Access:**
   - Navigate to Resume Builder
   - ATS Score component should be fully functional (not locked)
   - Should show "Calculate ATS Score" button and allow calculation

3. **Test Job Tailoring Access:**
   - In Resume Builder, find "Job-Specific Tailoring" toggle
   - Toggle should be enabled and clickable
   - Should allow entering job description

4. **Test Export Without Watermark:**
   - Click "Download" in Resume Builder
   - Should export PDF without watermark
   - No upgrade prompts should appear

5. **Test Premium Features Visibility:**
   - Navigate to Pricing page
   - Admin user should see "Current Plan" as Pro (if applicable)
   - All premium features should be accessible

### 3. Test with Regular User (Verification)

1. **Create/Login with Regular Email:**
   - Use any email OTHER than `codrix.solutions@gmail.com`
   - User should have `plan: 'free'` (or their actual plan)
   - No `isAdmin` flag

2. **Verify Regular User Restrictions:**
   - ATS Score should show locked/upgrade message
   - Job Tailoring toggle should be disabled
   - Export should show watermark warning

### 4. Test Edge Cases

1. **Case Insensitivity:**
   - Try `CODRIX.SOLUTIONS@GMAIL.COM` or `Codrix.Solutions@Gmail.Com`
   - Should still work (comparison is case-insensitive)

2. **Whitespace Handling:**
   - Email comparison trims whitespace automatically
   - Should work even if env var has trailing spaces

3. **Missing Environment Variable:**
   - Remove `ADMIN_EMAIL` from backend `.env`
   - Remove `VITE_ADMIN_EMAIL` from frontend `.env`
   - Admin override should be disabled (no errors, just normal behavior)

## Removing the Override Later

To remove the admin override feature:

1. **Delete the utility file:**
   ```bash
   rm server/utils/adminUtils.js
   ```

2. **Remove imports and calls from `userController.js`:**
   - Remove `import { isAdminUser, getEffectivePlan } from "../utils/adminUtils.js"`
   - Remove all admin check code blocks
   - Restore original user object returns

3. **Remove admin check from `featureGate.js`:**
   - Remove `isAdminUser()` function
   - Remove admin check from `getUserPlan()`

4. **Remove environment variables:**
   - Remove `ADMIN_EMAIL` from backend `.env`
   - Remove `VITE_ADMIN_EMAIL` from frontend `.env`

## Security Considerations

⚠️ **Important Notes:**
- Admin email is stored in environment variables (secure)
- Frontend admin email is exposed in client bundle (expected for Vite env vars)
- Admin checks are case-insensitive for better UX
- Regular users are NOT affected by this override
- Admin users can still make payments if desired (override takes precedence)

## Code Changes Summary

### Backend: 3 files changed
- ✅ `server/utils/adminUtils.js` - New utility functions
- ✅ `server/controllers/userController.js` - 3 functions updated

### Frontend: 1 file changed
- ✅ `client/src/pricing/featureGate.js` - `getUserPlan()` updated

### Total: 4 files (1 new, 3 modified)
