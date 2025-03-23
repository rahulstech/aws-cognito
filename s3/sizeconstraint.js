/**
 * post request is better than put request to upload file in s3. because in post request i can set accepted file size range.
 * where as in put request i can only set the exact file size.
 * 
 * I can set presigned url expiration. i can use the same url multiple time till it expires. by default there is no options to
 * accept only once. 
 */

const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');
const fs = require('node:fs/promises');
const axios = require('axios');
const path = require('node:path');
const { s3Client, BUCKET_NAME} = require('./s3client');

async function getPutSignedUrl(filename, filetype, filesize) {
    const cmd = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
        ContentType: filetype, // why the ContentType not working ?
        ContentLength: Number(filesize), // ensures upload size; but i want set the max size
    });
    const url = await getSignedUrl(s3Client, cmd);
    return url;
}

async function getSignedPostUrl(filename, filetype) {
    return await createPresignedPost(s3Client, {
        Bucket: BUCKET_NAME,
        Key: filename,

        // after Expires seconds the generated persigned post url will be unsuable
        // NOTE: before expiration i can use it multiple times
        // Expires: 900,

        // conditions are the constraints to be followed by the uploading object
        Conditions: [
            ['content-length-range', 0, 1048576 ], // upto 1MB
        ],

        // fields are saved as object metadata s3; meta-data values are always string
        Fields: {
            // these are system defined meta-data
            'Content-Type': filetype,
            'Content-Disposition': 'inline',

            // these are user defined meta data; user defined meta-data must have prefix X-Amz-Meta-
            'X-Amz-Meta-User-Id': '12345'
        }
    })
}

async function getFilesize(filepath) {
    const details = await fs.stat(filepath);
    return details.size;
}

async function testPUT() {
    const filename = 'image1.jpeg';
    const filetype = 'image/jepg';
    const filesize = await getFilesize(filename) ;

    const url = await getPutSignedUrl(filename, filetype, filesize);
    console.log('put signed url ', url);
}

async function testPOST(filename = "image1.jpeg") {
    const filetype = 'image/jepg';

    const url = await getSignedPostUrl(filename, filetype);
    console.log('post signed url ', url);

    const data = new FormData();
    Object.entries(url.fields).forEach(([k,v]) => {
        data.append(k,v);
    });
    const fileData = await fs.readFile(path.resolve(__dirname, filename));
    data.append('file', fileData);

    const { status, data: resdata } = await axios.post(url.url, data, {
        headers: data.headers
    });

    console.log('status: ', status);
    console.log('resdata: ', resdata);
}

// this will pass because file size is 10.3kb which is with in the accepted range
testPOST();

// this will fail as the file is is 2.3MB which exceeds the accepted rang
testPOST("bigimage.jpg");