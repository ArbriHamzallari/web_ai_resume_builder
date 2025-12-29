import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeftIcon, Lock, CheckCircle } from 'lucide-react'
import { PLANS, getPlanById } from '../pricing/plans'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { initiatePayPalPayment } from '../payments/paypal'
import { initiateLemonSqueezyPayment } from '../payments/lemonSqueezy'
import { getUserPlan } from '../pricing/featureGate'

const Checkout = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const authState = useSelector(state => state.auth)
  const { token } = useSelector(state => state.auth)
  
  const planId = searchParams.get('plan') || PLANS.FREE.id
  const plan = getPlanById(planId)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('paypal') // or 'lemonsqueezy'

  useEffect(() => {
    // Redirect if already on this plan
    const currentPlan = getUserPlan(authState)
    if (currentPlan === planId && planId !== PLANS.ONE_TIME.id) {
      toast('You are already on this plan')
      navigate('/app')
    }
  }, [authState, planId, navigate])

  const handleCheckout = async () => {
    if (!token) {
      toast.error('Please log in to continue')
      navigate('/app')
      return
    }

    setIsProcessing(true)

    try {
      if (paymentMethod === 'paypal') {
        await initiatePayPalPayment(plan, token, authState.user?._id)
      } else {
        await initiateLemonSqueezyPayment(plan, token, authState.user?._id)
      }
    } catch (error) {
      console.error('Payment initiation failed:', error)
      toast.error(error?.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/app/pricing"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Pricing
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Complete Your Purchase</h1>
            <p className="text-blue-100">You're upgrading to {plan.name}</p>
          </div>

          {/* Plan Summary */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                {plan.billing && (
                  <p className="text-sm text-gray-500">{plan.billing}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                </div>
                {plan.billing === 'monthly' && (
                  <p className="text-sm text-gray-500">per month</p>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-200">
              {Object.entries(plan.features).map(([key, value]) => {
                if (value === false) return null
                const featureNames = {
                  maxResumes: 'Resume Creation',
                  watermark: 'No Watermark',
                  atsScore: 'ATS Score',
                  jobTailoring: 'Job Tailoring',
                  exportFormats: 'Multiple Export Formats',
                  aiAssistance: 'AI Assistance',
                }
                return (
                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="size-4 text-green-500 flex-shrink-0" />
                    <span>{featureNames[key] || key}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="size-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">PayPal</div>
                  <div className="text-sm text-gray-500">Pay securely with PayPal</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="lemonsqueezy"
                  checked={paymentMethod === 'lemonsqueezy'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="size-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Lemon Squeezy</div>
                  <div className="text-sm text-gray-500">Credit card or other payment methods</div>
                </div>
              </label>
            </div>
          </div>

          {/* Total */}
          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                {plan.price === 0 ? 'Free' : `$${plan.price.toFixed(2)}`}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isProcessing || plan.price === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="size-5" />
                  {plan.price === 0 ? 'Continue' : 'Complete Purchase'}
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center mt-4">
              Your payment is secure and encrypted
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <Lock className="size-4" />
            <span>Secure payment powered by {paymentMethod === 'paypal' ? 'PayPal' : 'Lemon Squeezy'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

