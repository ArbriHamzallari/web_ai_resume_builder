import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Hero = () => {

    const {user} = useSelector(state => state.auth)

    const [menuOpen, setMenuOpen] = React.useState(false);
    const [displayText, setDisplayText] = React.useState('');
    const [currentPhraseIndex, setCurrentPhraseIndex] = React.useState(0);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const phrases = ['a remote job', 'paid more', 'hired', 'promoted', 'an interview'];

    React.useEffect(() => {
        const currentPhrase = phrases[currentPhraseIndex];
        let timeout;

        if (!isDeleting && displayText.length < currentPhrase.length) {
            // Typing
            timeout = setTimeout(() => {
                setDisplayText(currentPhrase.slice(0, displayText.length + 1));
            }, 100);
        } else if (!isDeleting && displayText.length === currentPhrase.length) {
            // Pause before deleting
            timeout = setTimeout(() => {
                setIsDeleting(true);
            }, 2000);
        } else if (isDeleting && displayText.length > 0) {
            // Deleting
            timeout = setTimeout(() => {
                setDisplayText(currentPhrase.slice(0, displayText.length - 1));
            }, 50);
        } else if (isDeleting && displayText.length === 0) {
            // Move to next phrase
            setIsDeleting(false);
            setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }

        return () => clearTimeout(timeout);
    }, [displayText, currentPhraseIndex, isDeleting, phrases]);

    // Smooth scroll handler
    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

  return (
    <>
    <div className="min-h-screen pb-8 md:pb-12">
        {/* Navbar */}
        <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm">
            <Link to="/">
                <img src="/logo.svg" alt="HireCraft logo" className="h-11 w-auto"/>
            </Link>

            <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800">
                <a href="#" onClick={(e) => handleNavClick(e, 'hero')} className="hover:text-purple-600 transition">Home</a>
                <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="hover:text-purple-600 transition">Features</a>
                <a href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')} className="hover:text-purple-600 transition">Testimonials</a>
                <Link to="/app/pricing" className="hover:text-purple-600 transition">Pricing</Link>
                <a href="#cta" onClick={(e) => handleNavClick(e, 'cta')} className="hover:text-purple-600 transition">Contact</a>
            </div>

            <div className="flex gap-2">
                <Link to='/app?state=register' className="hidden md:block px-6 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all rounded-full text-white" hidden={user}>
                    Get started
                </Link>
                <Link to='/app?state=login' className="hidden md:block px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900" hidden={user}>
                    Login
                </Link>
                <Link to='/app' className='hidden md:block px-8 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all rounded-full text-white' hidden={!user}>
                    Dashboard
                </Link>
            </div>

            <button onClick={() => setMenuOpen(true)} className="md:hidden active:scale-90 transition" >
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" className="lucide lucide-menu" >
                    <path d="M4 5h16M4 12h16M4 19h16" />
                </svg>
            </button>
        </nav>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 z-[100] bg-black/40 text-black backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`} >
            <a href="#" onClick={(e) => { handleNavClick(e, 'hero'); setMenuOpen(false); }} className="text-white">Home</a>
            <a href="#features" onClick={(e) => { handleNavClick(e, 'features'); setMenuOpen(false); }} className="text-white">Features</a>
            <a href="#testimonials" onClick={(e) => { handleNavClick(e, 'testimonials'); setMenuOpen(false); }} className="text-white">Testimonials</a>
            <Link to="/app/pricing" onClick={() => setMenuOpen(false)} className="text-white">Pricing</Link>
            <a href="#cta" onClick={(e) => { handleNavClick(e, 'cta'); setMenuOpen(false); }} className="text-white">Contact</a>
            <button onClick={() => setMenuOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-purple-600 hover:bg-purple-700 transition text-white rounded-md flex" >
                X
            </button>
        </div>

        {/* Hero Section */}
        <div id="hero" className="relative flex flex-col items-center justify-center text-sm px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-40 text-black">
            <div className="absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 xl:size-120 2xl:size-132 bg-purple-300 blur-[100px] opacity-30"></div>

            {/* Avatars + Stars */}
            <div className="flex items-center mt-24">
                <div className="flex -space-x-3 pr-3">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[1]" />
                    <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="user1" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-2" />
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="user2" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[3]" />
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[4]" />
                    <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="user5" className="size-8 rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[5]" />
                </div>

                <div>
                    <div className="flex ">
                        {Array(5).fill(0).map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-transparent fill-purple-600" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                        ))}
                    </div>
                    <p className="text-sm text-gray-700">
                        Used by 10,000+ users
                    </p>
                </div>
            </div>

            {/* Headline + CTA - CONVERSION FOCUSED */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold max-w-5xl text-center mt-4 md:leading-[70px] px-2">
                This resume builder gets you{' '}
                <span className="bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">
                    {displayText}
                    <span className="animate-pulse">|</span>
                </span>
            </h1>

            <p className="max-w-2xl text-center text-base md:text-lg my-5 md:my-7 text-slate-700 px-4">
                AI-powered <strong className="text-purple-600">ATS scoring</strong> and <strong className="text-purple-600">job-specific tailoring</strong> ensure your resume passes automated screening and matches exactly what employers want.
            </p>

            {/* Premium Feature Highlight */}
            <div className="max-w-3xl mx-auto my-6 md:my-8 p-4 md:p-6 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200 mx-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">Get Past the ATS. Land More Interviews.</h3>
                        <p className="text-xs md:text-sm text-slate-700">Our AI analyzes your resume against job descriptions and provides real-time ATS scores to maximize your chances.</p>
                    </div>
                    <Link to='/app/pricing' className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 md:px-8 py-2.5 md:py-3 font-semibold flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl text-sm md:text-base">
                        <span>Get ATS Match</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </Link>
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
                <Link to='/app' className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 md:px-9 h-11 md:h-12 m-1 ring-offset-2 ring-1 ring-purple-400 flex items-center justify-center transition-colors shadow-md hover:shadow-lg text-sm md:text-base w-full sm:w-auto">
                    Get started
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-1 size-4" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </Link>
                <button className="flex items-center justify-center gap-2 border border-slate-400 hover:bg-purple-50 transition rounded-full px-5 md:px-7 h-11 md:h-12 text-slate-700 text-sm md:text-base w-full sm:w-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video size-4 md:size-5" aria-hidden="true"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>
                    <span>Try demo</span>
                </button>
            </div>

        </div>
    </div>
    <style>
        {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

            * {
                font-family: 'Poppins', sans-serif;
            }
        `}
    </style>
    </>
  )
}

export default Hero
