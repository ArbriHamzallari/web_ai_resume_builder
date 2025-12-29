import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import ATSScore from '../components/ATSScore'
import JobTailoringToggle from '../components/JobTailoringToggle'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { canExportResume } from '../pricing/featureGate'

const ResumeBuilder = () => {

  const { resumeId } = useParams()
  const {token} = useSelector(state => state.auth)
  const authState = useSelector(state => state.auth)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  })

  const loadExistingResume = async () => {
   try {
    const {data} = await api.get('/api/resumes/get/' + resumeId, {headers: { Authorization: token }})
    if(data.resume){
      setResumeData(data.resume)
      document.title = data.resume.title;
    }
   } catch (error) {
    console.log(error.message)
   }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)
  const [jobTailoringEnabled, setJobTailoringEnabled] = useState(false)
  const [jobDescription, setJobDescription] = useState('')

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(()=>{
    loadExistingResume()
  },[])

  const changeResumeVisibility = async () => {
    try {
       const formData = new FormData()
       formData.append("resumeId", resumeId)
       formData.append("resumeData", JSON.stringify({public: !resumeData.public}))

       const {data} = await api.put('/api/resumes/update', formData, {headers: { Authorization: token }})

       setResumeData({...resumeData, public: !resumeData.public})
       toast.success(data.message)
    } catch (error) {
      console.error("Error saving resume:", error)
    }
  }

  const handleShare = () =>{
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;

    if(navigator.share){
      navigator.share({url: resumeUrl, text: "My Resume", })
    }else{
      alert('Share not supported on this browser.')
    }
  }

  const downloadResume = ()=>{
    const exportCheck = canExportResume(authState, false)
    if (!exportCheck.allowed) {
      toast.error(exportCheck.reason || 'Export not available')
      return
    }
    if (exportCheck.withWatermark) {
      toast('Exporting with watermark. Upgrade to remove it.', { icon: 'ℹ️' })
    }
    window.print()
  }


const saveResume = async () => {
  try {
    let updatedResumeData = structuredClone(resumeData)

    // remove image from updatedResumeData
    if(typeof resumeData.personal_info.image === 'object'){
      delete updatedResumeData.personal_info.image
    }

    const formData = new FormData();
    formData.append("resumeId", resumeId)
    formData.append('resumeData', JSON.stringify(updatedResumeData))
    removeBackground && formData.append("removeBackground", "yes");
    typeof resumeData.personal_info.image === 'object' && formData.append("image", resumeData.personal_info.image)

    const { data } = await api.put('/api/resumes/update', formData, {headers: { Authorization: token }})

    setResumeData(data.resume)
    toast.success(data.message)
  } catch (error) {
    console.error("Error saving resume:", error)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all duration-200 hover:translate-x-[-4px]'>
          <ArrowLeftIcon className="size-4"/> Back to Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-6 lg:gap-8'>
          {/* Left Panel - Form */}
          <div className='relative lg:col-span-5 space-y-4'>
            {/* Step Progress Indicator */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4'>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Progress</h3>
                <span className="text-xs text-gray-500">{activeSectionIndex + 1} of {sections.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 rounded-full transition-all duration-500 ease-out"
                  style={{width: `${((activeSectionIndex + 1) / sections.length) * 100}%`}}
                />
              </div>
              <div className="flex justify-between mt-2">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSectionIndex(index)}
                    className={`text-xs transition-all duration-200 ${
                      index <= activeSectionIndex 
                        ? 'text-blue-600 font-medium' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <section.icon className={`size-4 mx-auto mb-1 ${index <= activeSectionIndex ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="hidden sm:block">{section.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1 animate-slide-in-left'>
              {/* progress bar using activeSectionIndex */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200"/>
              <hr className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-500 ease-out" style={{width: `${((activeSectionIndex + 1) / sections.length) * 100}%`}}/>

              {/* Section Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-200 pb-4">

                <div className='flex items-center gap-2 flex-wrap'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=> setResumeData(prev => ({...prev, template}))}/>
                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData(prev => ({...prev, accent_color: color}))}/>
                </div>

                <div className='flex items-center gap-2'>
                  {activeSectionIndex !== 0 && (
                    <button 
                      onClick={()=> setActiveSectionIndex((prevIndex)=> Math.max(prevIndex - 1, 0))} 
                      className='flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 active:scale-95' 
                      disabled={activeSectionIndex === 0}
                    >
                      <ChevronLeft className="size-4"/> Previous
                    </button>
                  )}
                  <button 
                    onClick={()=> setActiveSectionIndex((prevIndex)=> Math.min(prevIndex + 1, sections.length - 1))} 
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 active:scale-95 ${activeSectionIndex === sections.length - 1 && 'opacity-50 cursor-not-allowed'}`} 
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next <ChevronRight className="size-4"/>
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className='space-y-6 animate-fade-in'>
                  {activeSection.id === 'personal' && (
                    <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=>setResumeData(prev => ({...prev, personal_info: data }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                  )}
                  {activeSection.id === 'summary' && (
                    <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data)=> setResumeData(prev=> ({...prev, professional_summary: data}))} setResumeData={setResumeData}/>
                  )}
                  {activeSection.id === 'experience' && (
                    <ExperienceForm data={resumeData.experience} onChange={(data)=> setResumeData(prev=> ({...prev, experience: data}))}/>
                  )}
                  {activeSection.id === 'education' && (
                    <EducationForm data={resumeData.education} onChange={(data)=> setResumeData(prev=> ({...prev, education: data}))}/>
                  )}
                  {activeSection.id === 'projects' && (
                    <ProjectForm data={resumeData.project} onChange={(data)=> setResumeData(prev=> ({...prev, project: data}))}/>
                  )}
                  {activeSection.id === 'skills' && (
                    <SkillsForm data={resumeData.skills} onChange={(data)=> setResumeData(prev=> ({...prev, skills: data}))}/>
                  )}
                  
              </div>
              <button 
                onClick={()=> {toast.promise(saveResume, {loading: 'Saving...', success: 'Saved!', error: 'Failed to save'})}} 
                className='w-full bg-gradient-to-br from-green-500 to-green-600 text-white font-medium rounded-lg px-6 py-3 mt-6 text-sm shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 active:scale-98'
              >
                Save Changes
              </button>
            </div>

            {/* ATS Score & Job Tailoring */}
            <div className="space-y-4">
              <ATSScore resumeData={resumeData} />
              <JobTailoringToggle 
                enabled={jobTailoringEnabled} 
                onToggle={setJobTailoringEnabled}
                jobDescription={jobDescription}
                onJobDescriptionChange={setJobDescription}
              />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className='lg:col-span-7 max-lg:mt-6'>
              <div className='sticky top-4'>
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex items-center justify-between flex-wrap gap-2'>
                  <h3 className="text-sm font-semibold text-gray-700">Live Preview</h3>
                  <div className='flex items-center gap-2 flex-wrap'>
                    {resumeData.public && (
                      <button 
                        onClick={handleShare} 
                        className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring-2 transition-all duration-200 active:scale-95'
                      >
                        <Share2Icon className='size-4'/> Share
                      </button>
                    )}
                    <button 
                      onClick={changeResumeVisibility} 
                      className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring-2 transition-all duration-200 active:scale-95'
                    >
                      {resumeData.public ? <EyeIcon className="size-4"/> : <EyeOffIcon className="size-4"/>}
                      {resumeData.public ? 'Public' : 'Private'}
                    </button>
                    <button 
                      onClick={downloadResume} 
                      className='flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 font-medium'
                    >
                      <DownloadIcon className='size-4'/> Download
                    </button>
                  </div>
                </div>

                <div className='bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-slide-in-right'>
                  <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
                </div>
              </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-left {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.4s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out;
        }
      `}</style>
      
    </div>
  )
}

export default ResumeBuilder
