const { getObjectUrl, putObjectUrl, listObjectsUrl, deleteObject } = require('./awss3');

(async () => {

    // generate presigned url for adding new object in bucket.
    // i need user postman to make a put request to the url before the url expires
    // const url =  await putObjectUrl(`avtar.png`,'image/png')
    // console.log('upload avtar png @ ', url)

    // List all entries in bucket
    // const items = await listObjectsUrl();
    // console.log('Bucket entries: ', items)

    // generate presigned url for accessing (view, download etc.) an existing object in object
    // const url = await getObjectUrl('avtar.png')
    // console.log('access avatar png @ ', url)

    // delete a non existing object
    // const response = await deleteObject('avtar.png');
    // console.log('delete avtar png response ', response);

})();