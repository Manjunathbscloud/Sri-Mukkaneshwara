// TextLocal SMS OTP Implementation
const https = require('https');

class TextLocalOTP {
    constructor(apiKey, sender = 'OTP') {
        this.apiKey = apiKey;
        this.sender = sender;
        this.baseUrl = 'https://api.textlocal.in/send/';
    }

    // Send OTP via TextLocal
    async sendOTP(phoneNumber, otp, message = null) {
        const defaultMessage = `Your Sri Mukkanneshwara Associate login OTP is: ${otp}. Valid for 5 minutes. Do not share this code.`;
        const smsMessage = message || defaultMessage;

        const payload = {
            apikey: this.apiKey,
            numbers: phoneNumber,
            message: smsMessage,
            sender: this.sender
        };

        return new Promise((resolve, reject) => {
            const postData = JSON.stringify(payload);
            
            const options = {
                hostname: 'api.textlocal.in',
                port: 443,
                path: '/send/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        if (response.status === 'success') {
                            resolve({
                                success: true,
                                messageId: response.batch_id,
                                message: 'OTP sent successfully',
                                provider: 'TextLocal'
                            });
                        } else {
                            resolve({
                                success: false,
                                error: response.errors ? response.errors[0].message : 'SMS sending failed',
                                provider: 'TextLocal'
                            });
                        }
                    } catch (error) {
                        resolve({
                            success: false,
                            error: 'Invalid response from TextLocal',
                            provider: 'TextLocal'
                        });
                    }
                });
            });

            req.on('error', (error) => {
                resolve({
                    success: false,
                    error: error.message,
                    provider: 'TextLocal'
                });
            });

            req.write(postData);
            req.end();
        });
    }

    // Check SMS balance
    async checkBalance() {
        const payload = {
            apikey: this.apiKey
        };

        return new Promise((resolve, reject) => {
            const postData = JSON.stringify(payload);
            
            const options = {
                hostname: 'api.textlocal.in',
                port: 443,
                path: '/balance/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        resolve(response);
                    } catch (error) {
                        resolve({ success: false, error: 'Invalid response' });
                    }
                });
            });

            req.on('error', (error) => {
                resolve({ success: false, error: error.message });
            });

            req.write(postData);
            req.end();
        });
    }
}

module.exports = TextLocalOTP;


