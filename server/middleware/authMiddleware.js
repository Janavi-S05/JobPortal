const jwt = require('jsonwebtoken')
const Company = require('../models/Company.js')

const protectCompany = async(req,res,next)=>{
    const token = req.headers.token

    if(!token){
        return res.json({success:false,message:"Not authorized login again"})
    }

    try{

        const decoded= jwt.verify(token, process.env.JWT_SECRET)
        req.company = await Company.findById(decoded.id).select('-password')
        next()

    }catch(error){
        res.json({success:false, message: error.message})
    }
}

module.exports=protectCompany