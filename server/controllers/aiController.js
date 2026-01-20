import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";

// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if(!userContent){
            return res.status(400).json({message: 'Missing required fields'})
        }

       const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else." },
                {
                    role: "user",
                    content: userContent,
                },
    ],
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if(!userContent){
            return res.status(400).json({message: 'Missing required fields'})
        }

       const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system",
                 content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else." },
                {
                    role: "user",
                    content: userContent,
                },
    ],
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for calculating ATS score
// POST: /api/ai/ats-score
// Note: Requires premium access (enforced by middleware)
export const calculateATSScore = async (req, res) => {
    try {
        const { resumeData } = req.body;

        if (!resumeData) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        let score = 0;
        let feedback = [];

        // Check personal info completeness (20 points)
        if (resumeData.personal_info?.full_name) score += 5;
        else feedback.push('Add your full name');
        
        if (resumeData.personal_info?.email) score += 5;
        else feedback.push('Add your email address');
        
        if (resumeData.personal_info?.phone) score += 5;
        else feedback.push('Add your phone number');
        
        if (resumeData.personal_info?.location) score += 5;
        else feedback.push('Add your location');

        // Check professional summary (15 points)
        if (resumeData.professional_summary && resumeData.professional_summary.length > 100) {
            score += 15;
        } else {
            feedback.push('Add a professional summary (100+ characters)');
        }

        // Check experience (30 points)
        if (resumeData.experience && resumeData.experience.length > 0) {
            score += 15;
            const hasDescriptions = resumeData.experience.some(exp => 
                exp.description && exp.description.length > 50
            );
            if (hasDescriptions) score += 15;
            else feedback.push('Add detailed descriptions to your work experience');
        } else {
            feedback.push('Add at least one work experience');
        }

        // Check education (15 points)
        if (resumeData.education && resumeData.education.length > 0) {
            score += 15;
        } else {
            feedback.push('Add your education details');
        }

        // Check skills (10 points)
        if (resumeData.skills && resumeData.skills.length >= 5) {
            score += 10;
        } else {
            feedback.push('Add at least 5 skills');
        }

        // Check projects (10 points)
        if (resumeData.project && resumeData.project.length > 0) {
            score += 10;
        } else {
            feedback.push('Add at least one project');
        }

        return res.status(200).json({
            score: Math.min(100, score),
            feedback
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
       
        const {resumeText, title} = req.body;
        const userId = req.userId;

        if(!resumeText){
            return res.status(400).json({message: 'Missing required fields'})
        }

        const systemPrompt = "You are an expert AI Agent to extract data from resume."

        const userPrompt = `extract data from this resume: ${resumeText}
        
        Provide data in the following JSON format with no additional text before or after:

        {
        professional_summary: { type: String, default: '' },
        skills: [{ type: String }],
        personal_info: {
            image: {type: String, default: '' },
            full_name: {type: String, default: '' },
            profession: {type: String, default: '' },
            email: {type: String, default: '' },
            phone: {type: String, default: '' },
            location: {type: String, default: '' },
            linkedin: {type: String, default: '' },
            website: {type: String, default: '' },
        },
        experience: [
            {
                company: { type: String },
                position: { type: String },
                start_date: { type: String },
                end_date: { type: String },
                description: { type: String },
                is_current: { type: Boolean },
            }
        ],
        project: [
            {
                name: { type: String },
                type: { type: String },
                description: { type: String },
            }
        ],
        education: [
            {
                institution: { type: String },
                degree: { type: String },
                field: { type: String },
                graduation_date: { type: String },
                gpa: { type: String },
            }
        ],          
        }
        `;

       const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system",
                 content: systemPrompt },
                {
                    role: "user",
                    content: userPrompt,
                },
        ],
        response_format: {type:  'json_object'}
        })

        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData)
        const newResume = await Resume.create({userId, title, ...parsedData})

        res.json({resumeId: newResume._id})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}