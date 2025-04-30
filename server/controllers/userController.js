const Job = require("../models/Job")
const JobApplication = require("../models/JobApplication")
const User = require("../models/User")
const {v2:cloudinary} = require('cloudinary');


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

// update user profile(resume)
const updateResume = async(req,res)=>{
    try {
        
        const userId = req.auth.userId
        const resumeFile = req.file
        const userData = await User.findById(userId)

        if(resumeFile)
        {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume= resumeUpload.secure_url
        }
        await userData.save()
        return res.json({success:true,message:'Resume updated'})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

module.exports = {
    getUserData,
    applyForJob,
    getUserJobApplications,
    updateResume
}
