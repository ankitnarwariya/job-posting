const Job = require("../models/job.model");

const createJobPost = async (req, res) => {
    try {
        const { companyName, title, description, logoUrl, salary, location, duration, locationType, skills, refUserId } = req.body;

        if (!companyName || !title || !description || !logoUrl || !salary || !location || !duration || !locationType || !skills || !refUserId) {
            return res.status(400).json({
                message: "Bad request"
            });
        }

        const userId = req.userId

        const jobDetails = new Job({ companyName, title, description, logoUrl, salary, location, duration, locationType, skills, refUserId: userId });

        await jobDetails.save();

        res.json({
            status: "SUCCESS",
            message: "Job has been created!"
        });
    } catch (error) {
        console.error("Something went wrong ERROR: ", error);
        res.status(500).json({
            status: "Something went wrong"
        });
    }
};

const getJobDetailsById = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const jobDetails = await Job.findById(jobId);

        if (!jobDetails) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            status: "SUCCESS",
            data: jobDetails
        });
    } catch (error) {
        console.error("Something went wrong ERROR: ", error);
        res.status(500).json({
            status: "Something went wrong"
        });
    }
};


const updateJobDetailsById = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const userId = req.userId;

        if (!jobId) {
            return res.status(400).json({
                message: "Bad request"
            });
        }

        const isJobExist = await Job.findOne({ _id: jobId, refUserId: userId });

        if (!isJobExist) {
            return res.status(400).json({
                message: "Bad request"
            });
        }

        const { companyName, title, description, logoUrl, salary, location, duration, locationType, skills } = req.body;

        if (!companyName || !title || !description || !logoUrl || !salary || !location || !duration || !locationType || !skills) {
            return res.status(400).json({
                message: "Bad request"
            });
        }

        await Job.updateOne({ _id: jobId }, { $set: { companyName, title, description, logoUrl, salary, location, duration, locationType, skills } });

        const updatedJobDetails = await Job.findById(jobId);

        res.json({
            status: "SUCCESS",
            message: "Job updated successfully",
            data: updatedJobDetails
        });
    } catch (error) {
        console.error("Something went wrong ERROR: ", error);
        res.status(500).json({
            status: "Something went wrong"
        });
    }
};

const deleteJobById = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        if (!jobId) {
            return res.status(400).json({
                message: "Bad request: Missing jobId"
            });
        }

        const deletedJob = await Job.findByIdAndDelete(jobId);

        if (!deletedJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            status: "SUCCESS",
            message: "Job deleted successfully",
            deletedJob: deletedJob
        });
    } catch (error) {
        console.error("Something went wrong ERROR: ", error);
        res.status(500).json({
            status: "Something went wrong"
        });
    }
}




const getAllJobs = async (req, res) => {
    try {
        const title = req.query.title || "";
        const skills = req.query.skills || "";
        let query = {};

        if (title) {
            query.title = { $regex: title, $options: "i" };
        }
        if (skills) {
            const skillList = skills.split(",");
            query.skills = { $in: skillList.map(skill => new RegExp(skill.trim(), "i")) };
        }

        const jobList = await Job.find(query);

        res.json({
            data: jobList
        });
    } catch (error) {
        console.error("Something went wrong ERROR: ", error);
        res.status(500).json({
            status: "Something went wrong"
        });
    }
};





module.exports = { createJobPost, getJobDetailsById, getAllJobs, updateJobDetailsById, deleteJobById, };