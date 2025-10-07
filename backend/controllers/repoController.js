import mongoose from "mongoose";
import Repository from "../models/repoModel.js";
import User from "../models/userModel.js";
import Issue from "../models/issueModel.js";


export const createRepository = async (req, res) => {
    const { owner, name, description, visibility, content, issues } = req.body;
    try {
        if(!name){
            return res.status(400).json({ message: "Repository name is required" });
        }
        if(!mongoose.Types.ObjectId.isValid(owner)){
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
        console.error("Error during updating:", err.message);
        res.status(500).send("Server error!");
    };
}
    export const getAllRepositories = async (req, res) => {
        res.send("get all repo");
    };

    export const fetchRepositoryById = async (req, res) => {
        res.send("fetched by id");
    };
    export const fetchRepositoryByName = (req, res) => {
        res.send("fetched by name");
    };
    export const fetchRepositoriesForCurrentUser = async (req, res) => {
        res.send("fetched for curr user");
    };

    export const updateRepositoryById = async (req, res) => {
        res.send("update by id");
    };

    export const toggleVisibilityById = async (req, res) => {
        res.send("toggle");
    };

    export const deleteRepositoryById = async (req, res) => {
        res.send("delete");
    };
