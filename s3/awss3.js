/**
 * Default expiry for any presigned url is 15 minutes
 */

const { S3Client, 
    GetObjectCommand, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand
 } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const { S3_BUCKET } = process.env

const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    },
});

async function getObjectUrl(key) {
    const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        ResponseExpires: new Date(Date.now() + 5 * 60), // 5 minutes from now
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
}

async function putObjectUrl(filename, contentType) {
    const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: filename,
        ContentType: contentType,
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
}

async function deleteObject(key) {
    const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
    });
    return await s3Client.send(command);
}

async function listObjectsUrl() {
    const command = new ListObjectsCommand({
        Bucket: S3_BUCKET
    });
    return await s3Client.send(command);
}

module.exports = { 
    getObjectUrl, putObjectUrl, deleteObject, listObjectsUrl,
};
