import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import dotenv from "dotenv"
import { ObjectId } from "mongodb";

dotenv.config();
const uri = process.env.MONGO_URL;

let client;

async function connectionClient() {
    if (!client) {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    }
    await client.connect();

}

export const getAllUsers = async (req, res) => {
    try {
        await connectionClient();
        const db = client.db("githubclone")
        const userCollection = db.collection("users");

        const users = await userCollection.find({}).toArray();
        res.json(users);
    } catch (err) {
        console.log("Error in login", err)
        return res.status(500).json({ message: "server error" })
    }
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
        res.send({ token , userId: result.insertedId});
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
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
        res.send({ token, userId: user._id });

    } catch (err) {
        console.log("Error in login", err)
        return res.status(500).json({ message: "server error" })
    }
};

export const getUserProfile = async (req, res) => {
    const currId = req.params.id;
    try {
        await connectionClient();
        const db = client.db("githubclone")
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({
            _id: new ObjectId(currId)

        })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        res.send(user);
    } catch (err) {
        console.log("Error in login", err)
        return res.status(500).json({ message: "server error" })
    }
};

export const updateUserProfile = async (req, res) => {
  try {
    const currentID = new ObjectId(req.params.id);
    const { email, password } = req.body;

    await connectionClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    let updateFields = {};
    if (email) updateFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    // Perform the update
    const result = await usersCollection.updateOne(
      { _id: currentID },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Fetch the updated user
    const updatedUser = await usersCollection.findOne({ _id: currentID });

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (err) {
    console.error("Error during updating:", err.message);
    res.status(500).send("Server error!");
  }
};

export const deleteUserProfile = async (req, res) => {
    const currentID = req.params.id;

    try {
        await connectionClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const result = await usersCollection.deleteOne({
            _id: new ObjectId(currentID),
        });

        if (result.deletedCount === 0) {  // corrected property
            return res.status(404).json({ message: "User not found!" });
        }

        res.json({ message: "User Profile Deleted!" });
    } catch (err) {
        console.error("Error during deletion: ", err.message);
        res.status(500).send("Server error!");
    }
};

export default deleteUserProfile;

