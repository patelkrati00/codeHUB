import fs from "fs";
import path from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

const revertRepo = async (commitId) => {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitDir = path.join(commitsPath, commitId);
        const files = await readdir(commitDir);

        const parentDir = path.resolve(repoPath, "..");

        for (const file of files) {
            await copyFile(path.join(commitDir, file), path.join(parentDir, file))
        }
        console.log(`commit ${commitId} successfully reverted`);
        

    } catch (err) {
        console.log("unable to revert", err);

    }
}
export default revertRepo;