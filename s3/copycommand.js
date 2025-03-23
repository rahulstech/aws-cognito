const { CopyObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, BUCKET_NAME } = require('./s3client');

const SOURCE_BUCKET = BUCKET_NAME;

async function copySameBucket(source, destination) {
    const cmd = new CopyObjectCommand({
        Bucket: BUCKET_NAME,
        CopySource: `${SOURCE_BUCKET}/${source}`,
        Key: destination,
        ContentType: 'image/png',

        // MetadataDirective accepts either 'REPLACE' or 'COPY'
        // when REPLACE only the provided metadata will be added, no metadata copied from source object
        // when COPY all the metadata copied from source object to destination object.

        // MetadataDirective: 'COPY',
        MetadataDirective: 'REPLACE',

        // Note: all the metadata given here are usser defined meta; therefore s3 itself prefixes X-Amz-Meta-, i don't
        // need to add it
        Metadata: {
            'User-Id': 'newuser-123456'
        }
    })

    /**
     * response object contains something like this
     * response:  {
        '$metadata': {
            httpStatusCode: 200,
            requestId: '57T407X6TAT911XC',
            extendedRequestId: '4rVGt3XMpaqFxI0LQ24jmXHCuvqhl9wUB6c58BV4gqaclIt6YyCM98DeJX0YF5qTfePznHyv3+s=',
            cfId: undefined,
            attempts: 1,
            totalRetryDelay: 0
        },
        ServerSideEncryption: 'AES256',
        CopyObjectResult: {
            ETag: '"c91dc10a0b596dded9e8e36cfa706c1a"',
            LastModified: 2025-03-23T12:21:43.000Z
        }
        }
     */
    const res = await s3Client.send(cmd);
    console.log('response: ', res);
}

// copy exiting object 
copySameBucket('avtar.png', `avtar-${Date.now()}-copy.png`);


// copy non existing object; throws NoSuchKey error; the error object contains the following 
// $metadata': {
//     httpStatusCode: 404,
//     requestId: '9EY10K48J5RDQC6M',
//     extendedRequestId: 'vNt6nbzTvnuuqwlm6NVxm+sc4d3YwyRmxrdNhABBY1CxZ3IE/Dm0D0ntQDe9nv6hTn7+hqunTBy/pzc2jSS0jw==',
//     cfId: undefined,
//     attempts: 1,
//     totalRetryDelay: 0
//   },
//   Code: 'NoSuchKey',
//   Key: 'not-exists.png',
//   RequestId: '9EY10K48J5RDQC6M',
//   HostId: 'vNt6nbzTvnuuqwlm6NVxm+sc4d3YwyRmxrdNhABBY1CxZ3IE/Dm0D0ntQDe9nv6hTn7+hqunTBy/pzc2jSS0jw=='
// copySameBucket('not-exists.png', `not-exists-copy.png`)
// .catch( (err) => {
//     console.log('copy non-existing error ', err);
// })
