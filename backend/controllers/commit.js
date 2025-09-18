import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const commitRepo = async (message) => {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const stagedPath = path.join(repoPath, "staging");
    const commitPath = path.join(repoPath, "commits")

    try {
        const commitId = uuidv4();
        const commitDir = path.join(commitPath, commitId);
        await fs.mkdir(commitDir, { recursive: true })

        const files = await fs.readdir(stagedPath);
        for (const file of files) {
            await fs.copyFile(path.join(stagedPath, file), path.join(commitDir, file))
        }

        await fs.writeFile(path.join(commitDir, "commit.json"), JSON.stringify({ message, date: new Date().toISOString() }))

        console.log(`committed with id ${commitId} with msg ${message}`)
    } catch (error) {
        console.log("error in commiting files", error);
    }
}

export default commitRepo;