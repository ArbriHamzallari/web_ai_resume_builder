import Payment from '../models/Payment.js'
import User from '../models/User.js'

// PayPal payment creation
export const createPayPalPayment = async (req, res) => {
  try {
    const { planId, userId, amount, billing } = req.body

    if (!planId || !userId || amount === undefined) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // In a real implementation, you would call PayPal SDK here
    // For now, we'll create a payment record and return a mock approval URL
    const payment = new Payment({
      userId,
      planId,
      amount,
      billing: billing || 'one-time',
      paymentProvider: 'paypal',
      status: 'pending',
    })

    await payment.save()

    // Mock PayPal approval URL - replace with actual PayPal SDK integration
    const approvalUrl = `${process.env.FRONTEND_URL || 'https://resume-frontend-5pbi.onrender.com'}/app/payments/paypal/callback?paymentId=${payment._id}`

    res.json({
      success: true,
      paymentId: payment._id,
      approvalUrl,
    })
  } catch (error) {
    console.error('PayPal payment creation error:', error)
    res.status(500).json({ message: 'Failed to create payment' })
  }
}

// PayPal payment execution
export const executePayPalPayment = async (req, res) => {
  try {
    const { paymentId, payerId } = req.body
    const userId = req.user?.userId

    if (!paymentId || !payerId) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const payment = await Payment.findById(paymentId)

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    if (payment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    // In a real implementation, you would verify and execute the payment with PayPal SDK
    // For now, we'll mark it as completed
    payment.status = 'completed'
    payment.providerPaymentId = payerId
    await payment.save()

    // Update user plan and set isPremium based on plan
    const isPremium = payment.planId === 'pro_monthly' || payment.planId === 'one_time'
    await User.findByIdAndUpdate(userId, {
      plan: payment.planId,
      isPremium: isPremium,
      planExpiresAt: payment.billing === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        : null,
    })

    res.json({
      success: true,
      message: 'Payment completed successfully',
      payment,
    })
  } catch (error) {
    console.error('PayPal payment execution error:', error)
    res.status(500).json({ message: 'Failed to execute payment' })
  }
}

// Lemon Squeezy checkout creation
export const createLemonSqueezyCheckout = async (req, res) => {
  try {
    const { planId, userId, amount, billing } = req.body

    if (!planId || !userId || amount === undefined) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // Create payment record
    const payment = new Payment({
      userId,
      planId,
      amount,
      billing: billing || 'one-time',
      paymentProvider: 'lemonsqueezy',
      status: 'pending',
    })

    await payment.save()

    // In a real implementation, you would call Lemon Squeezy API here
    // For now, we'll return a mock checkout URL
    const checkoutUrl = `${process.env.FRONTEND_URL || 'https://resume-frontend-5pbi.onrender.com'}/app/payments/lemonsqueezy/callback?paymentId=${payment._id}`

    res.json({
      success: true,
      paymentId: payment._id,
      checkoutUrl,
    })
  } catch (error) {
    console.error('Lemon Squeezy checkout creation error:', error)
    res.status(500).json({ message: 'Failed to create checkout' })
  }
}

// Lemon Squeezy webhook handler
export const handleLemonSqueezyWebhook = async (req, res) => {
  try {
    // In a real implementation, verify webhook signature
    const { event, data } = req.body

    if (event === 'order_created' || event === 'subscription_created') {
      const paymentId = data.attributes.first_order_item?.product_id || data.attributes.variant_id
      
      // Find payment by metadata or custom identifier
      const payment = await Payment.findOne({
        providerTransactionId: data.id,
      })

      if (payment) {
        payment.status = 'completed'
        payment.providerTransactionId = data.id
        await payment.save()

        // Update user plan and set isPremium based on plan
        const isPremium = payment.planId === 'pro_monthly' || payment.planId === 'one_time'
        await User.findByIdAndUpdate(payment.userId, {
          plan: payment.planId,
          isPremium: isPremium,
          planExpiresAt: payment.billing === 'monthly'
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            : null,
        })
      }
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Lemon Squeezy webhook error:', error)
    res.status(500).json({ message: 'Webhook processing failed' })
  }
}

// PayPal webhook handler
export const handlePayPalWebhook = async (req, res) => {
  try {
    // In a real implementation, verify webhook signature
    const { event_type, resource } = req.body

    if (event_type === 'PAYMENT.SALE.COMPLETED' || event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const paymentId = resource.id

      const payment = await Payment.findOne({
        providerPaymentId: paymentId,
      })

      if (payment) {
        payment.status = 'completed'
        payment.providerTransactionId = resource.id
        await payment.save()

        // Update user plan and set isPremium based on plan
        const isPremium = payment.planId === 'pro_monthly' || payment.planId === 'one_time'
        await User.findByIdAndUpdate(payment.userId, {
          plan: payment.planId,
          isPremium: isPremium,
          planExpiresAt: payment.billing === 'monthly'
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            : null,
        })
      }
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('PayPal webhook error:', error)
    res.status(500).json({ message: 'Webhook processing failed' })
  }
}

