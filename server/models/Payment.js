import mongoose from 'mongoose'

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  planId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending',
  },
  paymentProvider: {
    type: String,
    enum: ['paypal', 'lemonsqueezy'],
    required: true,
  },
  providerPaymentId: {
    type: String,
  },
  providerTransactionId: {
    type: String,
  },
  billing: {
    type: String,
    enum: ['monthly', 'one-time'],
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
}, { timestamps: true })

const Payment = mongoose.model('Payment', PaymentSchema)

export default Payment

