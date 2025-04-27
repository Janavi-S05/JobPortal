const express = require('express')

const router = express.Router()
const {getJobs,getJobById} = require("../controllers/jobController")

// Route to get all the jobs data
router.get('/',getJobs)

// Route to get a specific job by id
router.get('/:id',getJobById)

module.exports = router