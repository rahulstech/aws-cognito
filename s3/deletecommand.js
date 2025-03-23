const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, BUCKET_NAME } = require('./s3client');

async function deleteObject(Key) {
	const cmd = new DeleteObjectCommand({
		Bucket: BUCKET_NAME,
		Key,
	});

	/**
	 * NOTE even if any object with the given does not exists the delete command success
	 * example response like;
	 * {
		'$metadata': {
				httpStatusCode: 204,
				requestId: '8JM20APYHW9Z3K0D',
				extendedRequestId: 'hICvdlaQxa8tC44+y5QvmKY+1uAe+SMQKEcpdNRCUChIyj4DQBH63AKkcTbV94BpwIYTUFeMQeaFMvkpZnL02w==',
				cfId: undefined,
				attempts: 1,
				totalRetryDelay: 0
			}
		}
	 */

	const res = await s3Client.send(cmd);
	console.log(res);
}

// delete existing object; upload the object first in the s3 bucket manually
deleteObject('image.png');

// delete non-existing object
deleteObject('non-existing.jpg');
