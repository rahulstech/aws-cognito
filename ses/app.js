const { sendTextEmail, sendEmailAttachment } = require('./awsses');
const path = require('node:path');

const recipient = process.env.SES_DESTINATION;

(async () => {
    
    // send a text email to single recipient
    // const res = await sendTextEmail(recipient, "Aws Node Ses", "This email is sent as a part of aws ses with node lesson.");
    // console.log("sendTextEmail = ", res);

    // send attachment with email to single recipient
    const attachment_path = path.resolve(__dirname, 'express.png');
    const attachment = {
        filenam: path.basename(attachment_path),
        path: attachment_path,
    }
    const res = await sendEmailAttachment(recipient, "Aws Node Ses", attachment, 
        "this email is send as a part of aws ses with node lesson. i sent an attachment with the text message");
    console.log('sendEmailAttachement ', res);

})();