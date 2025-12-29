// PayPal payment integration
import api from '../configs/api'
import toast from 'react-hot-toast'

/**
 * Initiate PayPal payment
 */
export const initiatePayPalPayment = async (plan, token, userId) => {
  try {
    const response = await api.post(
      '/api/payments/paypal/create',
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

    if (response.data.approvalUrl) {
      // Redirect to PayPal
      window.location.href = response.data.approvalUrl
    } else {
      throw new Error('Failed to get PayPal approval URL')
    }
  } catch (error) {
    console.error('PayPal payment initiation error:', error)
    throw error
  }
}

/**
 * Handle PayPal return/callback
 */
export const handlePayPalReturn = async (token, paymentId, payerId) => {
  try {
    const response = await api.post(
      '/api/payments/paypal/execute',
      {
        paymentId,
        payerId,
      },
      {
        headers: { Authorization: token },
      }
    )

    if (response.data.success) {
      toast.success('Payment successful! Your plan has been upgraded.')
      return response.data
    } else {
      throw new Error('Payment execution failed')
    }
  } catch (error) {
    console.error('PayPal payment execution error:', error)
    toast.error('Payment failed. Please try again.')
    throw error
  }
}

