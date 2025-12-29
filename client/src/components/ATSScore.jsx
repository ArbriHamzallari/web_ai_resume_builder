import React, { useState, useEffect } from 'react'
import { TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { canAccessFeature } from '../pricing/featureGate'
import toast from 'react-hot-toast'

// Client-side ATS scoring simulation
const calculateATSScore = (resumeData) => {
  let score = 0
  let feedback = []

  // Check personal info completeness (20 points)
  if (resumeData.personal_info?.full_name) score += 5
  else feedback.push('Add your full name')
  
  if (resumeData.personal_info?.email) score += 5
  else feedback.push('Add your email address')
  
  if (resumeData.personal_info?.phone) score += 5
  else feedback.push('Add your phone number')
  
  if (resumeData.personal_info?.location) score += 5
  else feedback.push('Add your location')

  // Check professional summary (15 points)
  if (resumeData.professional_summary && resumeData.professional_summary.length > 100) {
    score += 15
  } else {
    feedback.push('Add a professional summary (100+ characters)')
  }

  // Check experience (30 points)
  if (resumeData.experience && resumeData.experience.length > 0) {
    score += 15
    const hasDescriptions = resumeData.experience.some(exp => 
      exp.description && exp.description.length > 50
    )
    if (hasDescriptions) score += 15
    else feedback.push('Add detailed descriptions to your work experience')
  } else {
    feedback.push('Add at least one work experience')
  }

  // Check education (15 points)
  if (resumeData.education && resumeData.education.length > 0) {
    score += 15
  } else {
    feedback.push('Add your education details')
  }

  // Check skills (10 points)
  if (resumeData.skills && resumeData.skills.length >= 5) {
    score += 10
  } else {
    feedback.push('Add at least 5 skills')
  }

  // Check projects (10 points)
  if (resumeData.project && resumeData.project.length > 0) {
    score += 10
  } else {
    feedback.push('Add at least one project')
  }

  return { score: Math.min(100, score), feedback }
}

const ATSScore = ({ resumeData }) => {
  const authState = useSelector(state => state.auth)
  const [score, setScore] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [isCalculating, setIsCalculating] = useState(false)

  const accessCheck = canAccessFeature(authState, 'atsScore')

  const handleCalculate = () => {
    if (!accessCheck.allowed) {
      toast.error(accessCheck.reason)
      return
    }

    setIsCalculating(true)
    // Simulate calculation delay
    setTimeout(() => {
      const result = calculateATSScore(resumeData)
      setScore(result.score)
      setFeedback(result.feedback)
      setIsCalculating(false)
    }, 800)
  }

  useEffect(() => {
    // Auto-calculate when resume data changes (if feature is available)
    if (accessCheck.allowed && resumeData) {
      const result = calculateATSScore(resumeData)
      setScore(result.score)
      setFeedback(result.feedback)
    }
  }, [resumeData, accessCheck.allowed])

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="size-5" />
    if (score >= 60) return <AlertCircle className="size-5" />
    return <XCircle className="size-5" />
  }

  if (!accessCheck.allowed) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="size-5 text-purple-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-purple-900">ATS Score</h3>
            <p className="text-sm text-purple-700 mt-1">{accessCheck.reason}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">ATS Score</h3>
        </div>
        {score !== null && (
          <div className={`px-3 py-1 rounded-full border font-semibold flex items-center gap-2 ${getScoreColor(score)}`}>
            {getScoreIcon(score)}
            {score}/100
          </div>
        )}
      </div>

      {score === null ? (
        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isCalculating ? 'Calculating...' : 'Calculate ATS Score'}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>

          {feedback.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600">Suggestions to improve:</p>
              <ul className="space-y-1">
                {feedback.slice(0, 3).map((item, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {score >= 80 && (
            <p className="text-xs text-green-700 bg-green-50 p-2 rounded">
              Great! Your resume is well-optimized for ATS systems.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default ATSScore

