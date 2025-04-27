const User = require("../models/User")


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

}

// Get user applied applications
const getUserJobApplications = async(req,res)=>{

}

// update user profile(resume)
const updateResume = async(req,res)=>{

}

module.exports = {
    getUserData,
    applyForJob,
    getUserJobApplications,
    updateResume
}
