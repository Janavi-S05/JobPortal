const express = require("express")
const router = express.Router()

const upload = require("../config/multer")
const {ChangeJobApplicationStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany} = require("../controllers/companyController")
const protectCompany = require("../middleware/authMiddleware")

//Register a company
router.post("/register",upload.single('image'), registerCompany)

//company login 
router.post("/login",loginCompany)

// Get company data
router.get("/company",protectCompany,getCompanyData)

// Post a job
router.post("/post-job",protectCompany,postJob)

// Get applicants data of company
router.get("/applicants",protectCompany,getCompanyJobApplicants)

// Get company job list
router.get("/list-jobs",protectCompany,getCompanyPostedJobs)

// Chnage application status
router.post("/change-status",protectCompany,ChangeJobApplicationStatus)

// Change applications visibility
router.post("/change-visibility",protectCompany,changeVisibility)

module.exports = router





