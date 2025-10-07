import mongoose from "mongoose";
import Repository from "../models/repoModel.js";
import User from "../models/userModel.js";
import Issue from "../models/issueModel.js";


export const createRepository = async (req, res) => {
    const { owner, name, description, visibility, content, issues } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: "Repository name is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ message: "Invalid owner ID" });
        }

        const newRepository = new Repository({
            owner,
            name,
            description,
            visibility,
            content,
            issues
        });
        const savedRepository = await newRepository.save();
        res.status(201).json(savedRepository);
    } catch (err) {
        console.error("Error during creating new repo:", err.message);
        res.status(500).send("Server error!");
    };
};

export const getAllRepositories = async (req, res) => {
    try {
        const repositories = await Repository.find().populate('owner');
        res.status(200).json(repositories);
    } catch (err) {
        console.error("Error fetching all repos:", err.message);
        res.status(500).send("Server error!");
    };
};

export const fetchRepositoryById = async (req, res) => {
    const repoId = req.params.id;
    console.log("Received repoId:", repoId);


    try {
        const repository = await Repository.findById(repoId).populate('owner').populate('issues');

        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }
        res.status(200).json(repository);
    } catch (err) {
        console.error("Error during fetching repo by its id:", err.message);
        res.status(500).send("Server error!");
    };
};

export const fetchRepositoryByName = async (req, res) => {
    const { name } = req.params;

    try {
        const repository = await Repository.findOne({ name }) // query object
            .populate('owner')
            .populate('issues');

        if (!repository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        res.status(200).json(repository);
    } catch (err) {
        console.error("Error fetching repository:", err.message);
        res.status(500).json({ message: "Server error!" });
    }
};

export const fetchRepositoriesForCurrentUser = async (req, res) => {
    const userId = req.user;
    try {
        const repositories = await Repository.find({ owner: userId }) // query object
            .populate('owner')
            .populate('issues');
        if (!repositories || repositories.length === 0) {
            return res.status(404).json({ message: "No repositories found for this user" });
        }
        res.status(200).json(repositories);
    } catch (err) {
        console.error("Error fetching repositories for curr user:", err.message);
        res.status(500).json({ message: "Server error!" });
    }
};

export const updateRepositoryById = async (req, res) => {
    const { id } = req.params;
    const { content, description } = req.body;

    try {
        const updatedRepository = await Repository.findByIdAndUpdate(
            id,
            { content, description },
            { new: true } // return the updated document
        ).populate('owner').populate('issues');
        if (!updatedRepository) {
            return res.status(404).json({ message: "Repository not found" });
        }
        res.status(200).json(updatedRepository);
    }
    catch (err) {
        console.error("Error in updating repository:", err.message);
        res.status(500).json({ message: "Server error!" });
    }

};

export const toggleVisibilityById = async (req, res) => {
    const { id } = req.params;
    try {

        const updatedRepository =
            await Repository.findByIdAndUpdate(
                id,
                [{ $set: { visibility: { $not: "$visibility" } } }], // aggregation pipeline update
                { new: true }
            ).populate('owner').populate('issues');
        if (!updatedRepository) {
            return res.status(404).json({ message: "Repository not found" });
        }
        res.status(200).json(updatedRepository);
    }
    catch (err) {
        console.error("Error in toggling repo:", err.message);
        res.status(500).json({ message: "Server error!" });
    }
};


export const deleteRepositoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRepository = await Repository.findByIdAndDelete(id);

        if (!deletedRepository) {
            return res.status(404).json({ message: "Repository not found" });
        }

        // Delete associated issues if any
        if (deletedRepository.issues && deletedRepository.issues.length > 0) {
            await Issue.deleteMany({ _id: { $in: deletedRepository.issues } });
        }

        res.status(200).json({ message: "Repository and associated issues deleted successfully" });
    } catch (err) {  
        console.error("Error deleting repository:", err.message);
        res.status(500).json({ message: "Server error!" });
    }
};
