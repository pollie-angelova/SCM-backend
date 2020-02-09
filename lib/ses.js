const AWSSES = require('aws-sdk/clients/sesv2');

class SES {

    constructor() {
        this.client = new AWSSES({ region: 'us-east-1' });
    }

    async sendDeliveredNotification(email, body, subject) {
        try {
            const params = {
                Content: {
                    Simple: {
                        Body: { Text: { Data: body, Charset: 'UTF-8' } },
                        Subject: { Data: subject, Charset: 'UTF-8' }
                    },
                },
                FromEmailAddress: 'poliangelova@abv.bg',
                Destination: { ToAddresses: [email] },
            };
            await this.client.sendEmail(params).promise()
        } catch (err) {
            console.error(err);
        }
    }

}

module.exports = { SES }
