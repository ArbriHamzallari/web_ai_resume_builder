import express from 'express'
import {
  createPayPalPayment,
  executePayPalPayment,
  createLemonSqueezyCheckout,
  handleLemonSqueezyWebhook,
  handlePayPalWebhook,
} from '../controllers/paymentController.js'
import protect from '../middlewares/authMiddleware.js'

const paymentRouter = express.Router()

// PayPal routes
paymentRouter.post('/paypal/create', protect, createPayPalPayment)
paymentRouter.post('/paypal/execute', protect, executePayPalPayment)
paymentRouter.post('/paypal/webhook', handlePayPalWebhook) // No auth for webhooks

// Lemon Squeezy routes
paymentRouter.post('/lemonsqueezy/create', protect, createLemonSqueezyCheckout)
paymentRouter.post('/lemonsqueezy/webhook', handleLemonSqueezyWebhook) // No auth for webhooks

export default paymentRouter

