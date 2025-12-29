import React from 'react'
import { Target, Sparkles } from 'lucide-react'
import { useSelector } from 'react-redux'
import { canAccessFeature } from '../pricing/featureGate'
import toast from 'react-hot-toast'

const JobTailoringToggle = ({ enabled, onToggle, jobDescription, onJobDescriptionChange }) => {
  const authState = useSelector(state => state.auth)
  const accessCheck = canAccessFeature(authState, 'jobTailoring')

  const handleToggle = () => {
    if (!accessCheck.allowed) {
      toast.error(accessCheck.reason)
      return
    }
    onToggle(!enabled)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${enabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Target className={`size-5 ${enabled ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Job-Specific Tailoring</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {enabled ? 'Optimizing for job description' : 'Enable to match job requirements'}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          disabled={!accessCheck.allowed}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            enabled ? 'bg-blue-600' : 'bg-gray-300'
          } ${!accessCheck.allowed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {enabled && accessCheck.allowed && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Paste job description (optional)
          </label>
          <textarea
            value={jobDescription || ''}
            onChange={(e) => {
              if (onJobDescriptionChange) {
                onJobDescriptionChange(e.target.value)
              }
            }}
            placeholder="Paste the job description here to optimize your resume..."
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows="3"
          />
          <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
            <Sparkles className="size-3" />
            <span>Resume will be optimized based on keywords</span>
          </div>
        </div>
      )}

      {!accessCheck.allowed && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-purple-700 bg-purple-50 p-2 rounded">
            {accessCheck.reason}
          </p>
        </div>
      )}
    </div>
  )
}

export default JobTailoringToggle

