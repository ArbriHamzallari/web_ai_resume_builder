import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSelector } from 'react-redux'

const TemplatesSlideshow = () => {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const { user } = useSelector(state => state.auth);

    const templates = [
        {
            id: 'classic',
            name: 'Classic',
            description: 'A clean, traditional resume format with clear sections and professional typography',
            preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=1000&fit=crop&q=80',
            color: 'from-blue-500 to-blue-600'
        },
        {
            id: 'modern',
            name: 'Modern',
            description: 'Sleek design with strategic use of color and modern font choices',
            preview: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&h=1000&fit=crop&q=80',
            color: 'from-purple-500 to-purple-600'
        },
        {
            id: 'minimal',
            name: 'Minimal',
            description: 'Ultra-clean design that puts your content front and center',
            preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=1000&fit=crop&q=80',
            color: 'from-green-500 to-green-600'
        },
        {
            id: 'minimal-image',
            name: 'Minimal Image',
            description: 'Minimal design with a single image and clean typography',
            preview: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&h=1000&fit=crop&q=80',
            color: 'from-orange-500 to-orange-600'
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % templates.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + templates.length) % templates.length);
    };

    return (
        <div id="templates" className="flex flex-col items-center my-12 md:my-20 px-4 md:px-8 lg:px-16 xl:px-24 scroll-mt-12">
            <div className="text-center mb-8 md:mb-12 px-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 mb-3 md:mb-4">
                    Choose Your Perfect Template
                </h2>
                <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                    Professional resume templates designed to help you stand out
                </p>
            </div>

            <div className="relative w-full max-w-6xl mx-auto">
                {/* Slideshow Container */}
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {templates.map((template, index) => (
                            <div 
                                key={template.id} 
                                className="min-w-full flex-shrink-0 w-full"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8 lg:p-12">
                                    {/* Template Preview */}
                                    <div className="flex items-center justify-center w-full">
                                        <div className={`w-full max-w-full md:max-w-lg aspect-[3/4] md:h-[500px] bg-gradient-to-br ${template.color} rounded-lg shadow-xl flex items-center justify-center relative overflow-hidden`}>
                                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                            <div className="relative z-10 text-center p-4 md:p-8 w-full h-full flex items-center justify-center">
                                                <div className="bg-white/90 rounded-lg p-4 md:p-6 shadow-lg w-full max-w-sm">
                                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{template.name}</h3>
                                                    <p className="text-sm md:text-base text-slate-600">{template.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Template Info */}
                                    <div className="flex flex-col justify-center space-y-4 md:space-y-6 text-center md:text-left">
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-3">{template.name} Template</h3>
                                            <p className="text-base md:text-lg text-slate-600">{template.description}</p>
                                        </div>
                                        <Link
                                            to={user ? `/app?template=${template.id}` : `/app?state=register&template=${template.id}`}
                                            className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 md:px-8 py-3 md:py-4 font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-base"
                                        >
                                            Use this template
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14"></path>
                                                <path d="m12 5 7 7-7 7"></path>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-purple-50 text-purple-600 rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all z-10"
                    aria-label="Previous template"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-purple-50 text-purple-600 rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all z-10"
                    aria-label="Next template"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Slide Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                    {templates.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === currentSlide
                                    ? 'w-8 bg-purple-600'
                                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TemplatesSlideshow
