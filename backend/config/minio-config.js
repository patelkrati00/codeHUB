import * as Minio from 'minio'; // ✅ Correct import for ESM

const minioClient = new Minio.Client({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
});

export default minioClient;
