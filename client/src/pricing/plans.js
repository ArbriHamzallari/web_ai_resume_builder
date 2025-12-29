// Pricing plans configuration
export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceLabel: 'Free',
    features: {
      maxResumes: 1,
      watermark: true,
      atsScore: false,
      jobTailoring: false,
      exportFormats: ['pdf'],
      aiAssistance: false,
    },
    limits: {
      resumes: 1,
      exports: 5, // per month
    }
  },
  PRO_MONTHLY: {
    id: 'pro_monthly',
    name: 'Pro',
    price: 9.99,
    priceLabel: '$9.99/month',
    billing: 'monthly',
    features: {
      maxResumes: -1, // unlimited
      watermark: false,
      atsScore: true,
      jobTailoring: true,
      exportFormats: ['pdf', 'docx'],
      aiAssistance: true,
    },
    limits: {
      resumes: -1, // unlimited
      exports: -1, // unlimited
    }
  },
  ONE_TIME: {
    id: 'one_time',
    name: 'Premium Export',
    price: 4.99,
    priceLabel: '$4.99',
    billing: 'one-time',
    features: {
      maxResumes: 1,
      watermark: false,
      atsScore: true,
      jobTailoring: true,
      exportFormats: ['pdf', 'docx'],
      aiAssistance: false,
    },
    limits: {
      resumes: 1,
      exports: 1, // single export
    }
  }
}

// Helper function to get plan by ID
export const getPlanById = (planId) => {
  return Object.values(PLANS).find(plan => plan.id === planId) || PLANS.FREE
}

// Helper function to check if user has access to a feature
export const hasFeature = (userPlan, feature) => {
  const plan = getPlanById(userPlan)
  return plan.features[feature] === true || plan.features[feature] === -1
}

// Helper function to check plan limits
export const checkLimit = (userPlan, limitType, currentUsage) => {
  const plan = getPlanById(userPlan)
  const limit = plan.limits[limitType]
  
  if (limit === -1) return true // unlimited
  return currentUsage < limit
}

