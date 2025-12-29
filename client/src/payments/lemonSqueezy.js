// Lemon Squeezy payment integration
import api from '../configs/api'
import toast from 'react-hot-toast'

/**
 * Initiate Lemon Squeezy checkout
 */
export const initiateLemonSqueezyPayment = async (plan, token, userId) => {
  try {
    const response = await api.post(
      '/api/payments/lemonsqueezy/create',
      {
        planId: plan.id,
        userId,
        amount: plan.price,
        billing: plan.billing,
      },
      {
        headers: { Authorization: token },
      }
    )

    if (response.data.checkoutUrl) {
      // Redirect to Lemon Squeezy checkout
      window.location.href = response.data.checkoutUrl
    } else {
      throw new Error('Failed to get Lemon Squeezy checkout URL')
    }
  } catch (error) {
    console.error('Lemon Squeezy payment initiation error:', error)
    throw error
  }
}

/**
 * Handle Lemon Squeezy webhook (called by backend)
 * This is just for reference - actual webhook handling is on backend
 */
export const verifyLemonSqueezyWebhook = async (signature, payload) => {
  // This would typically be handled on the backend
  // Frontend doesn't directly verify webhooks for security reasons
  console.log('Lemon Squeezy webhook verification should be done on backend')
}

