const Job = require("../models/Job")
const JobApplication = require("../models/JobApplication")
const User = require("../models/User")
const {v2:cloudinary} = require('cloudinary');


const { getEmbedding, cosineSimilarity } = require('../utils/embeddingUtility')

const pdfParse = require('pdf-parse'); // Add at the top
const fs = require('fs'); // Add at the top
const natural = require('natural'); // Add at the top

// Get user data
const getUserData = async(req,res) => {
    const userId = req.auth.userId
    try {
        
        const user = await User.findById(userId)
        if(!user)
        {
            return res.json({success:false,message:"User not found"})
        }
        res.json({success:true,user})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

const updateResume = async(req,res)=>{
    try {
        const userId = req.auth.userId
        const resumeFile = req.file
        const userData = await User.findById(userId)

        if(resumeFile)
        {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume= resumeUpload.secure_url

            // Extract text from PDF
            const dataBuffer = fs.readFileSync(resumeFile.path)
            const pdfData = await pdfParse(dataBuffer)
            userData.resumeText = pdfData.text // Save extracted text
        }
        await userData.save()
        return res.json({success:true,message:'Resume updated'})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// const matchJobsForUser = async (req, res) => {
//     const userId = req.auth.userId
//     try {
//         const user = await User.findById(userId)
//         if (!user || !user.resumeText) {
//             return res.json({ success: false, message: "Resume not uploaded or processed" })
//         }
//         const jobs = await Job.find({ visible: true })

//         // Use cosine similarity for better results
//         const tokenizer = new natural.WordTokenizer();
//         const resumeTokens = tokenizer.tokenize(user.resumeText.toLowerCase());

//         const matches = jobs.map(job => {
//             const jobTokens = tokenizer.tokenize((job.description || "").toLowerCase());
//             const allTokens = Array.from(new Set([...resumeTokens, ...jobTokens]));
//             const resumeVector = allTokens.map(token => resumeTokens.filter(t => t === token).length);
//             const jobVector = allTokens.map(token => jobTokens.filter(t => t === token).length);

//             // Cosine similarity calculation
//             const dotProduct = resumeVector.reduce((sum, val, i) => sum + val * jobVector[i], 0);
//             const magnitudeA = Math.sqrt(resumeVector.reduce((sum, val) => sum + val * val, 0));
//             const magnitudeB = Math.sqrt(jobVector.reduce((sum, val) => sum + val * val, 0));
//             const similarity = magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;

//             return {
//                 job,
//                 score: Math.round(similarity * 100) // 0-100%
//             }
//         });

//         matches.sort((a, b) => b.score - a.score)
//         res.json({ success: true, matches })
//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }



// ...existing code...

const matchJobsForUser = async (req, res) => {
    const userId = req.auth.userId
    try {
        const user = await User.findById(userId)
        if (!user || !user.resumeText|| user.resumeText.trim() === "") {
            console.log("No resumeText for user", userId)
            return res.json({ success: false, message: "Resume not uploaded or processed" })
        }
        const jobs = await Job.find({ visible: true })

        // Get embedding for resume
        const resumeEmbedding = await getEmbedding(user.resumeText)

        // Get embeddings and similarity for each job
        const matches = []
        for (const job of jobs) {
            const jobEmbedding = await getEmbedding(job.description || "")
            const similarity = cosineSimilarity(resumeEmbedding, jobEmbedding)
            matches.push({
                job,
                score: Math.round(similarity * 100)
            })
        }

        matches.sort((a, b) => b.score - a.score)
        res.json({ success: true, matches })
    } catch (error) {
        console.log("Error in matchJobsForUser:", error)
        res.json({ success: false, message: error.message })
    }
}

// Apply for a job
const applyForJob = async(req,res)=>{
    const {jobId} = req.body

    const userId = req.auth.userId
    try {
        
        const isApplied = await JobApplication.find({jobId,userId})

        if(isApplied.length>0)
        {
            return res.json({success:false,message:'Already applied'})
        }

        const jobData = await Job.findById(jobId)

        if(!jobData){
            return res.json({success:false,message:'Job not found'})
        }
        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        res.json({success:true,message:'Applied successfully'})
    
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// Get user applied applications
const getUserJobApplications = async(req,res)=>{
    try {
        const userId = req.auth.userId
        const applications = await JobApplication.find({userId})
        .populate('companyId','name email image')
        .populate('jobId','title description location category level salary')
        .exec()

        if(!applications){
            return res.json({success:false,message:'No job applications found'}) 
        }

        return res.json({success:true,applications})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// // update user profile(resume)
// const updateResume = async(req,res)=>{
//     try {
        
//         const userId = req.auth.userId
//         const resumeFile = req.file
//         const userData = await User.findById(userId)

//         if(resumeFile)
//         {
//             const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
//             userData.resume= resumeUpload.secure_url
//         }
//         await userData.save()
//         return res.json({success:true,message:'Resume updated'})

//     } catch (error) {
//         res.json({success:false,message:error.message})
//     }
// }

module.exports = {
    getUserData,
    applyForJob,
    getUserJobApplications,
    updateResume,
    matchJobsForUser
}
