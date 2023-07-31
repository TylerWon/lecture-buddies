import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/**
 * Uploads a student's profile picture to S3
 *
 * @param {file} file - the file to upload
 * @param {number} studentId - the student's id
 */
export const uploadPfpToS3 = async (file, studentId) => {
    const s3 = new S3Client({
        region: process.env.REACT_APP_AWS_REGION,
        credentials: {
            accessKeyId: process.env.REACT_APP_AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_S3_SECRET_ACCESS_KEY,
        },
    });

    const command = new PutObjectCommand({
        Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
        Key: studentId.toString(),
        Body: file,
    });

    await s3.send(command);
};
