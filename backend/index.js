import yargs from "yargs";
import {hideBin} from "yargs/helpers"
import initRepo from "./controllers/init.js"
import addRepo from "./controllers/add.js";
import commitRepo from "./controllers/commit.js";
import pushRepo from "./controllers/push.js";
import pullRepo from "./controllers/pull.js";
import revertRepo from "./controllers/revert.js";



yargs(hideBin(process.argv)).command("init","Initialise a new repository", {},initRepo)
.command("add <file>","Add file to the repository", (yargs)=>{
    yargs.positional("file", {
        describcoe: "File to add to the staging area",
        type: "String",
    })
},addRepo)
.command("commit <message>", "commit the staged file",(yargs)=>{
    yargs.positional("message",{
        describe: "commit message",
        type: "String"
    });
},commitRepo)
.command("push","push comm to s3",{},pushRepo)
.command("pull","pull commits from s3",{},pullRepo)
.command("revert <commitId>"," Revert to a specific commit",(yargs)=>{
    yargs.positional("commitId",{
        describe: "Commit Id to revert to",
        type: "String"
    });
}, revertRepo)
.demandCommand(1,"you need to enter atleast one command").help().argv