import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import dotenv from "dotenv"

dotenv.config();
const uri = process.env.MONGO_URL;

let client;

async function connectionClient() {
    if (!client) {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    }
    await client.connect();

}

export const getAllUsers = (req, res) => {
    res.send("all users");
};

export const signup = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        await connectionClient();
        const db = client.db("githubclone")
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({ username });

        if (user) {
            return res.status(400).json({ message: "user already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starRepos: []
        }

        const result = await userCollection.insertOne(newUser);
        const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
        res.send({ token });
    } catch (error) {
        console.log("err during signup", error);

    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        await connectionClient();
        const db = client.db("githubclone")
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
        res.send({ token, userId: user._id });

    } catch (err) {
        console.log("Error in login", err)
        return res.status(500).json({ message: "server error" })
    }
};

export const getUserProfile = (req, res) => {
    res.send("UserProfile");
};

export const updateUserProfile = (req, res) => {
    res.send("update UserProfile");
};

export const deleteUserProfile = (req, res) => {
    res.send("UserProfile deleted");
};
