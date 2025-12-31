import React from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { PLANS } from '../../pricing/plans'

const CompactPricing = () => {
    const plans = [
        {
            ...PLANS.FREE,
            name: 'Free',
            price: 0,
            highlight: false
        },
        {
            ...PLANS.PRO_MONTHLY,
            name: 'Pro',
            price: 9.99,
            highlight: true
        },
        {
            ...PLANS.ONE_TIME,
            name: 'Premium',
            price: 4.99,
            highlight: false
        }
    ];

    return (
        <div id="pricing" className="py-16 px-4 md:px-16 lg:px-24 xl:px-40 bg-gradient-to-br from-purple-50 via-white to-purple-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Choose the plan that works best for you
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                                plan.highlight
                                    ? 'border-purple-500 ring-4 ring-purple-200'
                                    : 'border-gray-200'
                            }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                    <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-slate-900">
                                            {plan.price === 0 ? 'Free' : `$${plan.price}`}
                                        </span>
                                        {plan.billing === 'monthly' && (
                                            <span className="text-gray-500">/month</span>
                                        )}
                                    </div>
                                </div>

                                <Link
                                    to={`/app/checkout?plan=${plan.id}`}
                                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 mb-6 ${
                                        plan.highlight
                                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                    }`}
                                >
                                    Choose Plan
                                </Link>

                                <div className="space-y-3">
                                    {plan.id === 'free' && (
                                        <>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="size-4 text-purple-600 flex-shrink-0" />
                                                <span className="text-gray-700">1 Resume</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="size-4 text-purple-600 flex-shrink-0" />
                                                <span className="text-gray-700">PDF Export</span>
                                            </div>
                                        </>
                                    )}
                                    {plan.id === 'pro_monthly' && (
                                        <>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="size-4 text-purple-600 flex-shrink-0" />
                                                <span className="text-gray-700">Unlimited Resumes</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="size-4 text-purple-600 flex-shrink-0" />
                                                <span className="text-gray-700">ATS Score</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="size-4 text-purple-600 flex-shrink-0" />
                                                <span className="text-gray-700">AI Assistance</span>
                                            </div>
                                        </>
                                    )}
                                    {plan.id === 'one_time' && (
                                        <>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="size-4 text-purple-600 flex-shrink-0" />
                                                <span className="text-gray-700">No Watermark</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="size-4 text-purple-600 flex-shrink-0" />
                                                <span className="text-gray-700">ATS Score</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Check className="size-4 text-purple-600 flex-shrink-0" />
                                                <span className="text-gray-700">DOCX Export</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CompactPricing
