const { HeadObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, BUCKET_NAME } = require('./s3client');

async function getObjectMeta(Key) {
    const cmd = new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key,
    });

    const res = await s3Client.send(cmd);
    console.log(res);
}



/**

// the following meta is related to http response
{
  '$metadata': {
    httpStatusCode: 200, // if object not found then 404
    requestId: 'BYYE1HHKGWMF2Z9F',
    extendedRequestId: 'G3LXT5I6q7m384Bt4gX8fNcDZP6dnpPNaUj0pqaWDJSJPPojDWXVTrgtdNQau1hs6Vc4eqghNJqqyyKF/Zdmc6nN+sLNF8AM',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  AcceptRanges: 'bytes',
  LastModified: 2025-02-17T02:34:12.000Z,
  ContentLength: 617502,
  ETag: '"c91dc10a0b596dded9e8e36cfa706c1a"',
  CacheControl: 'no-cache',
  ContentType: 'image/png',
  ServerSideEncryption: 'AES256',

  Metadata: {} // system or userdefined metas will be here
}


NOTE: user defined meta data key must start with x-amz-meta-
but in reponse object x-amz-meta- is omitted
 */
getObjectMeta('avtar.png');