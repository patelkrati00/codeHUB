import { promises as fs } from "fs";
import path from "path";
import minioClient from '../config/minio-config.js';


const BUCKET_NAME = "mybucket";
const pushRepo = async () => {
    const repoPath = path.resolve(process.cwd(), ".apnaGit")
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitDirs = await fs.readdir(commitsPath);
        for (const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir)
            const files = await fs.readdir(commitPath);

            for (const file of files) {
                const filePath = path.join(commitPath, file);
                const fileContent = await fs.readFile(filePath);

                await minioClient.putObject(
                    BUCKET_NAME,                  // Bucket name
                    `commits/${commitDir}/${file}`,  // Object key (like path in bucket)
                    fileContent                 // File content (Buffer or Stream)
                );
              
            }
        }
        console.log("all commits pushed to mybucket");
        
    } catch (error) {
        console.log("Error in pushing to minio", error)
    }
}

export default pushRepo;