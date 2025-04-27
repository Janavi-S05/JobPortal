const Job = require("../models/Job")


///Get all jobs
const getJobs = async (req, res) => {
    try {
        
        // removed password property from getting displayed
        const jobs = await Job.find({ visible: true }).populate({ path: 'companyId', select: '-password' })
        res.json({success:true,jobs})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// Get a specific job by id
const getJobById = async (req, res) => {
    try{

        const {id} = req.params
        const job = await Job.findById(id).populate({
            path:'companyId',
            select:'-password'
        })
        if(!job){
            return res.json({
                success:false,
                message:'Job not found'
            })
        }
        res.json({success: true,job})
    }catch(error){
        res.json({success: false,message:error.message})
    }
}
module.exports = {
    getJobs,
    getJobById
}