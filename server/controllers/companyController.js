const Company = require("../models/Company");
const bcrypt = require('bcrypt');
const { v2: cloudinary } = require('cloudinary');
const generateToken = require("../utils/generateToken");
const Job = require("../models/Job.js");
const JobApplication = require("../models/JobApplication.js");

// Register a new company
const registerCompany = async (req, res) => {
    const { name, email, password } = req.body;

    const imageFile = req.file;
    if (!name || !email || !password || !imageFile) {
        return res.json({ success: false, message: "Missing details" })
    }

    try {
        const companyExists = await Company.findOne({ email })
        if (companyExists) {
            return res.json({ success: false, message: "Company already registered" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        // upload the images in cloudinary platform
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// company login
const loginCompany = async (req, res) => {
    const { email, password } = req.body;

    console.log("Received login request for email:", email);

    try {
        // Check if company exists
        const company = await Company.findOne({ email });

        if (!company) {
            console.log("Company not found with the email:", email);
            return res.json({ success: false, message: "Company not found" });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, company.password);
        console.log("Password comparison result:", passwordMatch);

        if (passwordMatch) {
            console.log("Password matched. Logging in company:", company.name);
            res.json({
                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            });
        } else {
            console.log("Invalid password for email:", email);
            res.json({ success: false, message: "Invalid email or password" });
        }

    } catch (error) {
        console.error("Error during login:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get company data
const getCompanyData = async (req, res) => {
    try {
        const company = req.company
        res.json({ success: true, company })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Post a new job
const postJob = async (req, res) => {
    const { title, description, location, salary, level, category } = req.body

    const companyId = req.company._id
    console.log(companyId, { title, description, location, salary });

    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category
        })
        await newJob.save()
        res.json({ success: true, newJob })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get company job applicants
const getCompanyJobApplicants = async (req, res) => {
    try {
        const companyId = req.company._id
        // find job applications for the user and populate related data
        const applications = await JobApplication.find({ companyId })
            .populate('userId', 'name image resume')
            .populate('jobId', 'title location caetgory level salary')
            .exec()

        return res.json({ success: true, applications })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get company posted jobs
const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id
        const jobs = await Job.find({ companyId })

        // adding number of applicants info in data
        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await JobApplication.find({ jobId: job._id })
            return { ...job.toObject(), applicants: applicants.length }
        }))

        res.json({ success: true, jobsData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Change job application status
const ChangeJobApplicationStatus = async (req, res) => {

    try {
        const { id, status } = req.body

        console.log(req.body)
        if (!id || !status) {
            return res.json({ success: false, message: 'Missing id or status' });
        }

        // find job application and update status
        await JobApplication.findOneAndUpdate({ _id: id }, { status })
        
        res.json({ success: true, message: 'Status changed' })

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// Change job visibility
const changeVisibility = async (req, res) => {
    try {
        const { id } = req.body
        const companyId = req.company._id
        const job = await Job.findById(id)

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible
        }

        await job.save()
        res.json({ success: true, job })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

module.exports = {
    registerCompany,
    loginCompany,
    getCompanyData,
    postJob,
    getCompanyJobApplicants,
    getCompanyPostedJobs,
    ChangeJobApplicationStatus,
    changeVisibility
};