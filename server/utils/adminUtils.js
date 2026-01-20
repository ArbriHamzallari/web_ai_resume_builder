/**
 * Admin utility functions
 * Checks if a user has admin privileges based on email
 */

/**
 * Check if a user email matches the admin email from environment variables
 * @param {string} userEmail - The user's email to check
 * @returns {boolean} - True if user is an admin, false otherwise
 */
export const isAdminUser = (userEmail) => {
  if (!userEmail) return false
  
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return false
  
  // Case-insensitive email comparison
  return userEmail.toLowerCase().trim() === adminEmail.toLowerCase().trim()
}

/**
 * Check if user has access to premium features (ATS scoring, job tailoring)
 * Access is allowed if:
 * - user.isPremium === true
 * OR
 * - user.email === ADMIN_EMAIL
 * @param {Object} user - User object with email and isPremium properties
 * @returns {boolean} - True if user has premium access, false otherwise
 */
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

/**
 * Get the effective plan for a user (returns premium if admin, otherwise actual plan)
 * @param {Object} user - User object with email and plan properties
 * @returns {string} - Plan ID (either 'pro_monthly' for admin or user's actual plan)
 */
export const getEffectivePlan = (user) => {
  if (!user) return 'free'
  
  // If user is admin, always return premium plan
  if (isAdminUser(user.email)) {
    return 'pro_monthly'
  }
  
  // Otherwise return user's actual plan or default to free
  return user.plan || 'free'
}
