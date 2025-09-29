import express from "express";
import dotenv from "dotenv";       // load environment variables
import cors from "cors";           // enable cross-origin requests
import bodyParser from "body-parser";
import mongoose from "mongoose";   // MongoDB ODM
import { Server } from "socket.io";
import http from "http";
import mainRouter from "./routes/mainRouter.js";



import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import initRepo from "./controllers/init.js"
import addRepo from "./controllers/add.js";
import commitRepo from "./controllers/commit.js";
import pushRepo from "./controllers/push.js";
import pullRepo from "./controllers/pull.js";
import revertRepo from "./controllers/revert.js";
import { log } from "console";

dotenv.config();

yargs(hideBin(process.argv)).command("start", "Start a new server", {}, startServer).command("init", "Initialised a new repo", {}, initRepo)
    .command("add <file>", "Add file to the repository", (yargs) => {
        yargs.positional("file", {
            describcoe: "File to add to the staging area",
            type: "String",
        })
    }, (argv) => {
        addRepo(argv.file);
    })
    .command("commit <message>", "commit the staged file", (yargs) => {
        yargs.positional("message", {
            describe: "commit message",
            type: "String"
        });
    }, commitRepo)
    .command("push", "push comm to s3", {}, pushRepo)
    .command("pull", "pull commits from s3", {}, pullRepo)
    .command("revert <commitId>", " Revert to a specific commit", (yargs) => {
        yargs.positional("commitId", {
            describe: "Commit Id to revert to",
            type: "String"
        });
    }, (argv) => {
        revertRepo(argv.commitId);
    })
    .demandCommand(1, "you need to enter atleast one command").help().argv

function startServer() {
    const app = express();
    const port = process.env.PORT || 3000
    app.use(bodyParser.json());
    app.use(express.json());

    const mongoUrl = process.env.MONGO_URL;
    mongoose.connect(mongoUrl)
    .then(() => { console.log("mongoDb connected") })
    .catch((err) => { console.log("unable to connect to DB", err) })

    app.use(cors({origin:"*"}));

    app.use('/',mainRouter);

    let user = "test";
    const httpServer = http.createServer(app)
    const io = new Server(httpServer,{
        cors : {
            origin : "*",
            methods : ["GET","POST"],
        }
    });

    io.on("connection", (socket)=>{
        socket.on("joinRoom",(userId)=>{
            user = userId;
            console.log("=======")
            console.log(user)
            console.log("======")
            socket.join(userId)
        });
    })

const db = mongoose.connection;

    db.once("open",async ()=>{
        console.log("crud operations called");
    })

    httpServer.listen(port,()=>{
        console.log(`Server is listening on port ${port}`)
    })
}