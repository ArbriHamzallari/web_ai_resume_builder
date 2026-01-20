import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { requirePremiumAccess } from "../middlewares/premiumMiddleware.js";
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume, calculateATSScore} from "../controllers/aiController.js";



const aiRouter = express.Router();

// AI enhancement endpoints require premium access (for ATS-friendly content and job tailoring)
aiRouter.post('/enhance-pro-sum', protect, requirePremiumAccess, enhanceProfessionalSummary)
aiRouter.post('/enhance-job-desc', protect, requirePremiumAccess, enhanceJobDescription)
aiRouter.post('/ats-score', protect, requirePremiumAccess, calculateATSScore)
aiRouter.post('/upload-resume', protect, uploadResume)

export default aiRouter