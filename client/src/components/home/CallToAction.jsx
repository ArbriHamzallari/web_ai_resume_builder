import React from 'react'
import { Link } from 'react-router-dom'

const CallToAction = () => {
  return (
    <div id='cta' className='border-y border-dashed border-slate-200 w-full max-w-5xl mx-auto px-4 sm:px-10 md:px-16 mt-16 md:mt-28'>
            <div className="flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-6 md:gap-8 px-4 md:px-6 lg:px-10 border-x border-dashed border-slate-200 py-12 md:py-16 lg:py-20 -mt-8 md:-mt-10 -mb-8 md:-mb-10 w-full">
                <p className="text-lg md:text-xl font-medium max-w-md text-slate-800">Build a Professional Resume That Helps You Stand Out and Get Hired</p>
                <Link to='/app/pricing' className="flex items-center justify-center gap-2 rounded-full py-3 px-6 md:px-8 bg-purple-600 hover:bg-purple-700 transition text-white text-sm md:text-base">
                    <span>Get Started</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 md:size-4.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
            </div>
        </div>
  )
}

export default CallToAction
