// Feature gating utility
// Defaults to FREE plan if status unknown - never blocks app rendering

import { PLANS, getPlanById, hasFeature, checkLimit } from './plans.js'

/**
 * Get user's current plan from Redux state or localStorage
 * Defaults to FREE if unknown
 */
export const getUserPlan = (authState) => {
  if (!authState || !authState.user) {
    return PLANS.FREE.id
  }
  
  // Check if user has plan stored (we'll add this to user model later)
  const storedPlan = authState.user.plan || localStorage.getItem('userPlan')
  return storedPlan || PLANS.FREE.id
}

/**
 * Check if user can access a specific feature
 * Returns { allowed: boolean, reason?: string, upgradeRequired?: boolean }
 */
export const canAccessFeature = (authState, feature) => {
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

