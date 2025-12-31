import React from 'react'

const ResumeStatistic = () => {
    const [resumeCount, setResumeCount] = React.useState(0);

    React.useEffect(() => {
        // Generate random number between 5,000 and 20,000
        const randomCount = Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000;
        setResumeCount(randomCount);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                {resumeCount.toLocaleString()}
            </p>
            <p className="text-lg md:text-xl text-slate-700 font-medium">
                resumes created today
            </p>
        </div>
    )
}

export default ResumeStatistic
