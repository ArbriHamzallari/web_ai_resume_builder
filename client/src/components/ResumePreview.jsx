import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import { useSelector } from 'react-redux'
import { canExportResume } from '../pricing/featureGate'

const ResumePreview = ({data, template, accentColor, classes = ""}) => {
  const authState = useSelector(state => state.auth)
  const exportCheck = canExportResume(authState, false)
  const showWatermark = exportCheck.withWatermark

    const renderTemplate = ()=>{
        switch (template) {
            case "modern":
                return <ModernTemplate data={data} accentColor={accentColor}/>;
            case "minimal":
                return <MinimalTemplate data={data} accentColor={accentColor}/>;
            case "minimal-image":
                return <MinimalImageTemplate data={data} accentColor={accentColor}/>;

            default:
                return <ClassicTemplate data={data} accentColor={accentColor}/>;
        }
    }

  return (
    <div className='w-full bg-gray-100 relative'>
      {showWatermark && (
        <div className="absolute inset-0 pointer-events-none z-10 print:hidden">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(0,0,0,0.1) 100px, rgba(0,0,0,0.1) 200px)',
            }}
          />
          <div className="absolute bottom-4 right-4 text-gray-400 text-xs font-semibold transform -rotate-12">
            FREE VERSION
          </div>
        </div>
      )}
      <div id="resume-preview" className={"border border-gray-200 print:shadow-none print:border-none relative " + classes}>
        {renderTemplate()}
        {showWatermark && (
          <div className="print:block hidden absolute bottom-2 right-2 text-gray-400 text-xs opacity-50">
            FREE VERSION
          </div>
        )}
      </div>

      <style>{`
        @page {
          size: letter;
          margin: 0;
        }
        @media print {
          html, body {
            width: 8.5in;
            height: 11in;
            overflow: hidden; 
          }
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
          }
          ${showWatermark ? `
          #resume-preview::after {
            content: "FREE VERSION";
            position: absolute;
            bottom: 10px;
            right: 10px;
            color: rgba(0, 0, 0, 0.3);
            font-size: 10px;
            font-weight: bold;
            pointer-events: none;
            z-index: 9999;
          }
          ` : ''}
        }
      `}</style>
    </div>
  )
}

export default ResumePreview
