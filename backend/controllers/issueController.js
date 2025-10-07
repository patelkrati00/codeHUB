import Issue from "../models/Issue.js";

// Create an issue
export const createIssue = async (req, res) => {
    const { id } = req.params; // repository ID
    const { title, description } = req.body;

    try {
        const issue = new Issue({
            title,
            description,
            repository: id
        });

        await issue.save();
        res.status(201).json(issue);
    } catch (err) {
        console.error("Error creating an issue:", err.message);
        res.status(500).json({ message: "Server error!" });
    }
};

// Update an issue
export const updateIssueById = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const issue = await Issue.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        res.status(200).json(issue);
    } catch (err) {
        console.error("Error updating an issue:", err.message);
        res.status(500).json({ message: "Server error!" });
    }
};

// Delete an issue
export const deleteIssueById = async (req, res) => {
    const { id } = req.params;

    try {
        const issue = await Issue.findByIdAndDelete(id);

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        res.status(200).json({ message: "Issue deleted successfully" });
    } catch (err) {
        console.error("Error deleting an issue:", err.message);
        res.status(500).json({ message: "Server error!" });
    }
};

// Get all issues for a repository
export const getAllIssues = async (req, res) => {
    const { id } = req.query; // repository ID from query param

    if (!id) {
        return res.status(400).json({ message: "Repository ID is required" });
    }

    try {
        const issues = await Issue.find({ repository: id });

        if (!issues || issues.length === 0) {
            return res.status(404).json({ message: "No issues found" });
        }

        res.status(200).json(issues);
    } catch (err) {
        console.error("Error fetching issues:", err.message);
        res.status(500).json({ message: "Server error!" });
    }
};

// Get issue by ID
export const getIssueById = async (req, res) => {
    const { id } = req.params;

    try {
        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        res.status(200).json(issue);
    } catch (err) {
        console.error("Error fetching issue:", err.message);
        res.status(500).json({ message: "Server error!" });
    }
};
