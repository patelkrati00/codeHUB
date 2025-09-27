import { promises as fs } from "fs";
import path from "path";
import minioClient from '../config/minio-config.js';

const BUCKET_NAME = "mybucket";

const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

const pullRepo = async () => {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const stream = minioClient.listObjectsV2(BUCKET_NAME, "commits/", true);

    for await (const obj of stream) {
      const key = obj.name; // full path in bucket, e.g. commits/<commit-id>/file.txt

      // Determine the local directory path of the file (exclude the file itself)
      const commitDir = path.join(commitsPath, path.dirname(key).split('/').pop());

      // Ensure the directory exists locally
      await fs.mkdir(commitDir, { recursive: true });

      // Get the file as a stream from MinIO
      const fileStream = await minioClient.getObject(BUCKET_NAME, key);

      // Convert stream to buffer so it can be saved
      const fileBuffer = await streamToBuffer(fileStream);

      // Get the base filename (e.g. file.txt)
      const fileName = path.basename(key);

      // Write fileBuffer to the local directory with the correct filename
      await fs.writeFile(path.join(commitDir, fileName), fileBuffer);

      console.log(`Pulled file: ${path.join(commitDir, fileName)}`);
    }

    console.log(" All commits pulled successfully.");

  } catch (error) {
    console.log("Unable to pull:", error);
  }
};

export default pullRepo;
