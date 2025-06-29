const express = require("express")
const { getUserData, applyForJob, getUserJobApplications, updateResume, matchJobsForUser } = require("../controllers/userController")
const upload = require("../config/multer")

const router = express.Router()

// Get user data
router.get('/user',getUserData)

// Apply for job
router.post('/apply',applyForJob)

// Get applied jobs data
router.get('/applications',getUserJobApplications)

// Update user profile
router.post('/update-resume',upload.single('resume'),updateResume)

router.get('/match-jobs', matchJobsForUser)

module.exports=router