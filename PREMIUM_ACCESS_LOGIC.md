# Premium Access Logic for ATS Scoring and Job Tailoring

## Access Rule

**Access is allowed if:**
```javascript
user.isPremium === true
OR
user.email === ADMIN_EMAIL
```

## Implementation Summary

### Backend (Mandatory - API Protection)

#### 1. User Model (`server/models/User.js`)
- Added `isPremium: {type: Boolean, default: false}`
- Added `plan: {type: String, default: 'free'}`

#### 2. Utility Functions (`server/utils/adminUtils.js`)

**`hasPremiumAccess(user)`** - Main access check function:
```javascript
export const hasPremiumAccess = (user) => {
  if (!user) return false
  
  // Check if user is premium
  if (user.isPremium === true) {
    return true
  }
  
  // Check if user is admin
  if (isAdminUser(user.email)) {
    return true
  }
  
  return false
}
```

**Conditional Logic:**
```javascript
user.isPremium === true || isAdminUser(user.email)
```

#### 3. Premium Middleware (`server/middlewares/premiumMiddleware.js`)

**`requirePremiumAccess`** - Middleware that protects endpoints:
```javascript
export const requirePremiumAccess = async (req, res, next) => {
  const userId = req.userId
  const user = await User.findById(userId)
  
  // FINAL CONDITIONAL LOGIC:
  if (!hasPremiumAccess(user)) {
    return res.status(403).json({ 
      message: 'Premium access required',
      requiresUpgrade: true
    })
  }
  
  next()
}
```

#### 4. Protected API Endpoints (`server/routes/aiRoutes.js`)

Protected with `requirePremiumAccess` middleware:
- ✅ `POST /api/ai/enhance-pro-sum` - Job tailoring (professional summary)
- ✅ `POST /api/ai/enhance-job-desc` - Job tailoring (job description)
- ✅ `POST /api/ai/ats-score` - ATS scoring

**Route Implementation:**
```javascript
aiRouter.post('/enhance-pro-sum', protect, requirePremiumAccess, enhanceProfessionalSummary)
aiRouter.post('/enhance-job-desc', protect, requirePremiumAccess, enhanceJobDescription)
aiRouter.post('/ats-score', protect, requirePremiumAccess, calculateATSScore)
```

#### 5. User Controller Updates (`server/controllers/userController.js`)

**Sets `isPremium: true` for admin users on:**
- Registration (`registerUser`)
- Login (`loginUser`)
- Get user data (`getUserById`)

#### 6. Payment Controller (`server/controllers/paymentController.js`)

**Sets `isPremium` based on plan:**
```javascript
const isPremium = payment.planId === 'pro_monthly' || payment.planId === 'one_time'
await User.findByIdAndUpdate(userId, {
  plan: payment.planId,
  isPremium: isPremium,
  // ...
})
```

### Frontend (Recommended - UI Checks)

#### 1. Feature Gate (`client/src/pricing/featureGate.js`)

**`hasPremiumAccess(authState)`** - Frontend access check:
```javascript
export const hasPremiumAccess = (authState) => {
  if (!authState || !authState.user) return false
  
  // FINAL CONDITIONAL LOGIC:
  if (authState.user.isPremium === true) {
    return true
  }
  
  if (isAdminUser(authState.user.email)) {
    return true
  }
  
  return false
}
```

**`canAccessFeature(authState, feature)`** - Feature-specific check:
```javascript
export const canAccessFeature = (authState, feature) => {
  // For ATS Score and Job Tailoring, use premium access check
  if (feature === 'atsScore' || feature === 'jobTailoring') {
    // FINAL CONDITIONAL LOGIC:
    const hasAccess = hasPremiumAccess(authState)
    
    if (!hasAccess) {
      return {
        allowed: false,
        reason: 'This feature requires premium access. Upgrade to Pro or One-Time plan.',
        upgradeRequired: true
      }
    }
    
    return { allowed: true }
  }
  
  // For other features, use plan-based check...
}
```

#### 2. Components Using Checks

**ATSScore Component (`client/src/components/ATSScore.jsx`):**
```javascript
const accessCheck = canAccessFeature(authState, 'atsScore')

if (!accessCheck.allowed) {
  // Show locked UI
  return <LockedComponent reason={accessCheck.reason} />
}

// Show full ATS scoring UI
```

**JobTailoringToggle Component (`client/src/components/JobTailoringToggle.jsx`):**
```javascript
const accessCheck = canAccessFeature(authState, 'jobTailoring')

if (!accessCheck.allowed) {
  // Disable toggle, show upgrade message
  return <DisabledToggle reason={accessCheck.reason} />
}

// Show enabled toggle
```

## Final Conditional Logic

### Backend (Server-Side)
```javascript
// In premiumMiddleware.js and adminUtils.js
hasPremiumAccess(user) {
  return user.isPremium === true || user.email === ADMIN_EMAIL
}
```

### Frontend (Client-Side)
```javascript
// In featureGate.js
hasPremiumAccess(authState) {
  const user = authState.user
  return user.isPremium === true || user.email === VITE_ADMIN_EMAIL
}

// For ATS Score and Job Tailoring
canAccessFeature(authState, 'atsScore' | 'jobTailoring') {
  return hasPremiumAccess(authState)
}
```

## API Endpoint Protection

All premium endpoints are protected:

1. **Authentication Required:** `protect` middleware
2. **Premium Access Required:** `requirePremiumAccess` middleware

**Protected Endpoints:**
- `POST /api/ai/enhance-pro-sum` - Requires premium
- `POST /api/ai/enhance-job-desc` - Requires premium
- `POST /api/ai/ats-score` - Requires premium

**Response if unauthorized:**
```json
{
  "message": "Premium access required. This feature requires a premium subscription.",
  "requiresUpgrade": true
}
```

## Flow Diagram

```
User Action (ATS Score / Job Tailoring)
    ↓
Frontend Check: canAccessFeature(authState, feature)
    ↓
Check: user.isPremium === true OR user.email === ADMIN_EMAIL
    ↓
If allowed: Show feature UI
If denied: Show upgrade message
    ↓
User attempts to use feature (API call)
    ↓
Backend: requirePremiumAccess middleware
    ↓
Check: user.isPremium === true OR user.email === ADMIN_EMAIL
    ↓
If allowed: Process request
If denied: Return 403 Forbidden
```

## Testing

### Test Case 1: Premium User
- `user.isPremium = true`
- `user.email = "premium@example.com"`
- ✅ Access granted (backend & frontend)

### Test Case 2: Admin User
- `user.isPremium = false`
- `user.email = ADMIN_EMAIL` (e.g., "codrix.solutions@gmail.com")
- ✅ Access granted (backend & frontend)

### Test Case 3: Regular User
- `user.isPremium = false`
- `user.email = "regular@example.com"`
- ❌ Access denied (backend & frontend)

### Test Case 4: No User
- `user = null` or `user = undefined`
- ❌ Access denied (backend & frontend)

## Security Notes

✅ **Backend validation is mandatory** - Frontend checks are for UX only
✅ **API endpoints are protected** - Cannot bypass by manipulating frontend
✅ **Admin email is environment variable** - Not hardcoded
✅ **Case-insensitive email comparison** - More user-friendly
✅ **No premium logic relies only on frontend** - All checks enforced server-side
