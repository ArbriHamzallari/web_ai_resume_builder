# Final Conditional Logic for Premium Access

## Access Rule

**Access is allowed if:**
```javascript
user.isPremium === true
OR
user.email === ADMIN_EMAIL
```

---

## Backend Implementation

### 1. Core Access Check Function

**File:** `server/utils/adminUtils.js`

```javascript
export const hasPremiumAccess = (user) => {
  if (!user) return false
  
  // FINAL CONDITIONAL LOGIC:
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

**Where:** Used by premium middleware and user controllers

---

### 2. Premium Middleware (API Protection)

**File:** `server/middlewares/premiumMiddleware.js`

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

**Applied to endpoints:**
- `POST /api/ai/enhance-pro-sum` (Job Tailoring - Summary)
- `POST /api/ai/enhance-job-desc` (Job Tailoring - Description)
- `POST /api/ai/ats-score` (ATS Scoring)

---

### 3. User Model Updates

**File:** `server/models/User.js`

```javascript
const UserSchema = new mongoose.Schema({
    name: {type: String, required: true },
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    isPremium: {type: Boolean, default: false }, // ✅ Added
    plan: {type: String, default: 'free' }, // ✅ Added
}, {timestamps: true })
```

**Where:** User data stored in database

---

### 4. User Controller (Set isPremium for Admin)

**File:** `server/controllers/userController.js`

**Registration:**
```javascript
if (isAdminUser(newUser.email)) {
    userObj.isPremium = true // Admin users get premium access
    userObj.isAdmin = true
}
```

**Login:**
```javascript
if (isAdminUser(user.email)) {
    userObj.isPremium = true // Admin users get premium access
    userObj.isAdmin = true
}
```

**Get User:**
```javascript
if (isAdminUser(user.email)) {
    userObj.isPremium = true // Admin users get premium access
    userObj.isAdmin = true
}
```

---

### 5. Payment Controller (Set isPremium on Payment)

**File:** `server/controllers/paymentController.js`

```javascript
const isPremium = payment.planId === 'pro_monthly' || payment.planId === 'one_time'
await User.findByIdAndUpdate(userId, {
  plan: payment.planId,
  isPremium: isPremium, // ✅ Set based on plan
  // ...
})
```

**Where:** When payment is completed (PayPal/LemonSqueezy)

---

## Frontend Implementation

### 1. Core Access Check Function

**File:** `client/src/pricing/featureGate.js`

```javascript
export const hasPremiumAccess = (authState) => {
  if (!authState || !authState.user) return false
  
  // FINAL CONDITIONAL LOGIC:
  // Check if user is premium
  if (authState.user.isPremium === true) {
    return true
  }
  
  // Check if user is admin
  if (isAdminUser(authState.user.email)) {
    return true
  }
  
  return false
}
```

**Where:** Used by feature gate functions

---

### 2. Feature Access Check

**File:** `client/src/pricing/featureGate.js`

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

**Where:** Used by ATSScore and JobTailoringToggle components

---

### 3. Component Usage

**ATSScore Component:**
```javascript
const accessCheck = canAccessFeature(authState, 'atsScore')

// FINAL CONDITIONAL LOGIC:
if (!accessCheck.allowed) {
  // Show locked UI
  return <LockedComponent />
}

// Show full ATS scoring UI
```

**JobTailoringToggle Component:**
```javascript
const accessCheck = canAccessFeature(authState, 'jobTailoring')

// FINAL CONDITIONAL LOGIC:
if (!accessCheck.allowed) {
  // Disable toggle
  return <DisabledToggle />
}

// Show enabled toggle
```

---

## Complete Conditional Logic

### Backend (Mandatory)

```javascript
// In server/utils/adminUtils.js
export const hasPremiumAccess = (user) => {
  return user.isPremium === true || isAdminUser(user.email)
}

// In server/middlewares/premiumMiddleware.js
if (!hasPremiumAccess(user)) {
  return res.status(403).json({ message: 'Premium access required' })
}
```

**Applied to:**
- ✅ `POST /api/ai/enhance-pro-sum`
- ✅ `POST /api/ai/enhance-job-desc`
- ✅ `POST /api/ai/ats-score`

---

### Frontend (Recommended)

```javascript
// In client/src/pricing/featureGate.js
export const hasPremiumAccess = (authState) => {
  const user = authState.user
  return user.isPremium === true || isAdminUser(user.email)
}

// For ATS Score and Job Tailoring
export const canAccessFeature = (authState, feature) => {
  if (feature === 'atsScore' || feature === 'jobTailoring') {
    return hasPremiumAccess(authState)
  }
}
```

**Applied to:**
- ✅ `ATSScore` component
- ✅ `JobTailoringToggle` component

---

## Truth Table

| user.isPremium | user.email === ADMIN_EMAIL | Access Allowed |
|----------------|---------------------------|----------------|
| `true`         | `false`                   | ✅ **YES**     |
| `false`        | `true`                    | ✅ **YES**     |
| `true`         | `true`                    | ✅ **YES**     |
| `false`        | `false`                   | ❌ **NO**      |
| `null`/`undefined` | `false`              | ❌ **NO**      |

---

## Code Locations Summary

### Backend Files:
1. ✅ `server/utils/adminUtils.js` - `hasPremiumAccess()` function
2. ✅ `server/middlewares/premiumMiddleware.js` - `requirePremiumAccess()` middleware
3. ✅ `server/models/User.js` - Added `isPremium` field
4. ✅ `server/controllers/userController.js` - Sets `isPremium` for admin users
5. ✅ `server/controllers/paymentController.js` - Sets `isPremium` on payment
6. ✅ `server/routes/aiRoutes.js` - Protected endpoints
7. ✅ `server/controllers/aiController.js` - Added ATS score endpoint

### Frontend Files:
1. ✅ `client/src/pricing/featureGate.js` - `hasPremiumAccess()` and `canAccessFeature()`
2. ✅ `client/src/components/ATSScore.jsx` - Uses `canAccessFeature()`
3. ✅ `client/src/components/JobTailoringToggle.jsx` - Uses `canAccessFeature()`

---

## Security Checklist

✅ **Backend validation is mandatory** - All API endpoints protected
✅ **Frontend checks for UX** - Provides immediate feedback
✅ **No frontend-only logic** - Backend always validates
✅ **Admin email from env** - Not hardcoded
✅ **Case-insensitive comparison** - User-friendly
✅ **Database stores isPremium** - Persistent across sessions

---

## Testing Examples

### Test 1: Premium User
```javascript
user = { isPremium: true, email: "premium@example.com" }
hasPremiumAccess(user) // ✅ true
```

### Test 2: Admin User
```javascript
user = { isPremium: false, email: "codrix.solutions@gmail.com" }
hasPremiumAccess(user) // ✅ true (admin override)
```

### Test 3: Regular User
```javascript
user = { isPremium: false, email: "regular@example.com" }
hasPremiumAccess(user) // ❌ false
```

### Test 4: No User
```javascript
user = null
hasPremiumAccess(user) // ❌ false
```
