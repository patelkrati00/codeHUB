import { promises as fs } from "fs";
import path from "path";

const addRepo = async(filePath) => {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const stagingPath = path.join(repoPath, "staging");

    try {
        await fs.mkdir(stagingPath, {recursive:true});
        const fileName = path.basename(filePath);
        await fs.copyFile(filePath, path.join(stagingPath,fileName));
        console.log(`file ${fileName} added to staging area successfully`)
        
    } catch (error) {
        console.log("error in add", error)
    }
}

export default addRepo;