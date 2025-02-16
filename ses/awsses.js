const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const nodemailer = require('nodemailer');

const { AWS_ID, AWS_SECRET, SES_REIGON, SES_SOURCE } = process.env;

const sesClient = new SESClient({
    region: SES_REIGON,
    credentials: {
        accessKeyId: AWS_ID,
        secretAccessKey: AWS_SECRET,
    },
});

// create nodemailer SES transport
const transport = nodemailer.createTransport({
    SES: { ses: sesClient, aws: require('@aws-sdk/client-ses') }
})

async function sendTextEmail(recipient, subject, textMsg) {
    const command = new SendEmailCommand({
        Source: SES_SOURCE,
        Destination: {
            ToAddresses: [recipient]
        },
        Message: {
            Subject: { Data: subject, },

            Body: {
                Text: { Data: textMsg, },
            }
        }
    });
    return await sesClient.send(command)
}

/**
 * send email with text ( optional ) with attachment. aws sdk does not provides built in method
 * to send attachement. there is SendRawEmailCommand class; but i need to create the smtp request
 * manually with headers and body which is error prone. rather i used nodemailer package and used
 * ses as a transport. later i used transport.sendMail(options, cb) to send the email.
 */
function sendEmailAttachment(recipient, subject, { filename, path }, textMsg = "") {
    const options = {
        from: SES_SOURCE,
        to: recipient,
        subject,
        text: !textMsg ? undefined : textMsg,
        attachments: [
            {
                filename,path,
            },
        ],
    }

    return new Promise((resolve, reject) => {
        transport.sendMail(options, (err, info) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(info);
        });
    });
}

module.exports = { 
    sendTextEmail, sendEmailAttachment,
}

