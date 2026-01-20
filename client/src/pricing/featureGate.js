// Feature gating utility
// Defaults to FREE plan if status unknown - never blocks app rendering

import { PLANS, getPlanById, hasFeature, checkLimit } from './plans.js'

/**
 * Check if a user email matches the admin email from environment variables
 * @param {string} userEmail - The user's email to check
 * @returns {boolean} - True if user is an admin, false otherwise
 */
const isAdminUser = (userEmail) => {
  if (!userEmail) return false
  
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
  if (!adminEmail) return false
  
  // Case-insensitive email comparison
  return userEmail.toLowerCase().trim() === adminEmail.toLowerCase().trim()
}

/**
 * Check if user has premium access for ATS scoring and job tailoring
 * Access is allowed if:
 * - user.isPremium === true
 * OR
 * - user.email === ADMIN_EMAIL
 * @param {Object} authState - Auth state with user object
 * @returns {boolean} - True if user has premium access, false otherwise
 */
export const hasPremiumAccess = (authState) => {
  if (!authState || !authState.user) return false
  
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

/**
 * Get user's current plan from Redux state or localStorage
 * Admin premium override: If user is admin, always returns pro_monthly
 * Defaults to FREE if unknown
 */
export const getUserPlan = (authState) => {
  if (!authState || !authState.user) {
    return PLANS.FREE.id
  }
  
  // Admin premium override: Check if user is admin first
  if (isAdminUser(authState.user.email)) {
    return PLANS.PRO_MONTHLY.id
  }
  
  // Check if user has plan stored (we'll add this to user model later)
  const storedPlan = authState.user.plan || localStorage.getItem('userPlan')
  return storedPlan || PLANS.FREE.id
}

/**
 * Check if user can access a specific feature (ATS Score, Job Tailoring)
 * For premium features, access is allowed if:
 * - user.isPremium === true
 * OR
 * - user.email === ADMIN_EMAIL
 * Returns { allowed: boolean, reason?: string, upgradeRequired?: boolean }
 */
export const canAccessFeature = (authState, feature) => {
  // For ATS Score and Job Tailoring, use premium access check
  if (feature === 'atsScore' || feature === 'jobTailoring') {
    const hasAccess = hasPremiumAccess(authState)
    
    if (!hasAccess) {
      return {
        allowed: false,
        reason: 'This feature requires premium access. Upgrade to Pro or One-Time plan.',
        upgradeRequired: true,
        currentPlan: getPlanById(getUserPlan(authState))
      }
    }
    
    return { 
      allowed: true, 
      currentPlan: getPlanById(PLANS.PRO_MONTHLY.id) 
    }
  }
  
  // For other features, use plan-based check
  const userPlan = getUserPlan(authState)
  const plan = getPlanById(userPlan)
  
  const allowed = hasFeature(userPlan, feature)
  
  if (!allowed) {
    return {
      allowed: false,
      reason: `This feature requires a ${plan.id === PLANS.FREE.id ? 'Pro' : 'upgraded'} plan`,
      upgradeRequired: true,
      currentPlan: plan
    }
  }
  
  return { allowed: true, currentPlan: plan }
}

/**
 * Check if user can perform an action based on limits
 */
export const canPerformAction = (authState, actionType, currentUsage = 0) => {
  const userPlan = getUserPlan(authState)
  const allowed = checkLimit(userPlan, actionType, currentUsage)
  
  if (!allowed) {
    const plan = getPlanById(userPlan)
    return {
      allowed: false,
      reason: `You've reached your ${actionType} limit for the ${plan.name} plan`,
      upgradeRequired: true,
      currentPlan: plan
    }
  }
  
  return { allowed: true }
}

/**
 * Check if user can export resume (considering watermark)
 */
export const canExportResume = (authState, withWatermark = true) => {
  const userPlan = getUserPlan(authState)
  const plan = getPlanById(userPlan)
  
  // Free users can export but with watermark
  if (plan.id === PLANS.FREE.id) {
    return {
      allowed: true,
      withWatermark: true,
      reason: withWatermark ? 'Export will include watermark' : 'Remove watermark requires upgrade'
    }
  }
  
  return {
    allowed: true,
    withWatermark: false,
    currentPlan: plan
  }
}

/**
 * Get upgrade suggestion for a feature
 */
export const getUpgradeSuggestion = (feature) => {
  // Determine which plan unlocks this feature
  if (feature === 'atsScore' || feature === 'jobTailoring' || feature === 'watermark') {
    return PLANS.PRO_MONTHLY
  }
  if (feature === 'export') {
    return PLANS.ONE_TIME
  }
  return PLANS.PRO_MONTHLY
}

