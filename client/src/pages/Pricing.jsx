import React from 'react'
import { Link } from 'react-router-dom'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'
import { PLANS } from '../pricing/plans'
import { useSelector } from 'react-redux'
import { getUserPlan } from '../pricing/featureGate'

const Pricing = () => {
  const authState = useSelector(state => state.auth)
  const currentPlan = getUserPlan(authState)

  const features = [
    { name: 'Resume Creation', free: true, pro: true, oneTime: true },
    { name: 'Multiple Templates', free: true, pro: true, oneTime: true },
    { name: 'Color Customization', free: true, pro: true, oneTime: true },
    { name: 'PDF Export', free: true, pro: true, oneTime: true },
    { name: 'Watermark Removal', free: false, pro: true, oneTime: true },
    { name: 'ATS Score', free: false, pro: true, oneTime: true },
    { name: 'Job-Specific Tailoring', free: false, pro: true, oneTime: true },
    { name: 'Unlimited Resumes', free: false, pro: true, oneTime: false },
    { name: 'AI Assistance', free: false, pro: true, oneTime: false },
    { name: 'DOCX Export', free: false, pro: true, oneTime: true },
  ]

  const plans = [
    {
      ...PLANS.FREE,
      icon: Sparkles,
      popular: false,
      cta: 'Current Plan',
      disabled: currentPlan === PLANS.FREE.id,
    },
    {
      ...PLANS.PRO_MONTHLY,
      icon: Zap,
      popular: true,
      cta: 'Upgrade to Pro',
      disabled: false,
    },
    {
      ...PLANS.ONE_TIME,
      icon: Crown,
      popular: false,
      cta: 'Buy Now',
      disabled: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock powerful features to create professional resumes that stand out
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrentPlan = currentPlan === plan.id

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular
                    ? 'border-blue-500 ring-4 ring-blue-200'
                    : 'border-gray-200'
                } ${isCurrentPlan ? 'opacity-75' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${
                      plan.popular ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`size-6 ${
                        plan.popular ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                      {plan.billing && (
                        <p className="text-sm text-gray-500">{plan.billing}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price === 0 ? 'Free' : `$${plan.price}`}
                      </span>
                      {plan.billing === 'monthly' && (
                        <span className="text-gray-500">/month</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{plan.priceLabel}</p>
                  </div>

                  <Link
                    to={isCurrentPlan ? '#' : `/app/checkout?plan=${plan.id}`}
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                      isCurrentPlan
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                    onClick={(e) => isCurrentPlan && e.preventDefault()}
                  >
                    {isCurrentPlan ? plan.cta : plan.cta}
                  </Link>

                  <div className="mt-6 space-y-3">
                    {features.map((feature, index) => {
                      const hasFeature = plan.id === PLANS.FREE.id
                        ? feature.free
                        : plan.id === PLANS.PRO_MONTHLY.id
                        ? feature.pro
                        : feature.oneTime

                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          {hasFeature ? (
                            <Check className="size-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <span className="size-4 text-gray-300 flex-shrink-0">×</span>
                          )}
                          <span
                            className={hasFeature ? 'text-gray-700' : 'text-gray-400'}
                          >
                            {feature.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What's the difference between Pro and One-Time?
              </h3>
              <p className="text-gray-600 text-sm">
                Pro is a monthly subscription with unlimited resumes and all features. 
                One-Time is a single premium export without watermark, perfect for one-time use.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel my Pro subscription anytime?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 text-sm">
                We offer a 30-day money-back guarantee for Pro subscriptions. One-time purchases are non-refundable.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Pricing

