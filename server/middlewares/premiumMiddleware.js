import User from '../models/User.js'
import { hasPremiumAccess } from '../utils/adminUtils.js'

/**
 * Middleware to check if user has premium access for ATS scoring and job tailoring
 * Access is allowed if:
 * - user.isPremium === true
 * OR
 * - user.email === ADMIN_EMAIL
 * 
 * Returns 403 if user doesn't have premium access
 */
export const requirePremiumAccess = async (req, res, next) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Fetch user from database
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check premium access
    if (!hasPremiumAccess(user)) {
      return res.status(403).json({ 
        message: 'Premium access required. This feature requires a premium subscription.',
        requiresUpgrade: true
      })
    }

    // User has premium access, continue
    next()
  } catch (error) {
    console.error('Premium middleware error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
