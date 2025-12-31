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
        <div id="templates" className="flex flex-col items-center my-20 px-4 md:px-16 lg:px-24 xl:px-40 scroll-mt-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
                    Choose Your Perfect Template
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Professional resume templates designed to help you stand out
                </p>
            </div>

            <div className="relative w-full max-w-5xl">
                {/* Slideshow Container */}
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {templates.map((template, index) => (
                            <div 
                                key={template.id} 
                                className="min-w-full flex-shrink-0"
                            >
                                <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                                    {/* Template Preview */}
                                    <div className="flex items-center justify-center">
                                        <div className={`w-full max-w-md h-[600px] bg-gradient-to-br ${template.color} rounded-lg shadow-xl flex items-center justify-center relative overflow-hidden`}>
                                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                            <div className="relative z-10 text-center p-8">
                                                <div className="bg-white/90 rounded-lg p-6 shadow-lg">
                                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{template.name}</h3>
                                                    <p className="text-slate-600">{template.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Template Info */}
                                    <div className="flex flex-col justify-center space-y-6">
                                        <div>
                                            <h3 className="text-3xl font-bold text-slate-900 mb-3">{template.name} Template</h3>
                                            <p className="text-lg text-slate-600">{template.description}</p>
                                        </div>
                                        <Link
                                            to={user ? `/app?template=${template.id}` : `/app?state=register&template=${template.id}`}
                                            className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-4 font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-purple-50 text-purple-600 rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10"
                    aria-label="Previous template"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-purple-50 text-purple-600 rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10"
                    aria-label="Next template"
                >
                    <ChevronRight className="w-6 h-6" />
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
