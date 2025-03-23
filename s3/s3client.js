const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    }
});

module.exports = { s3Client, BUCKET_NAME: 'bucket-aws-nodejs' }