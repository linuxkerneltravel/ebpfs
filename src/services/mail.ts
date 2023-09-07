export default class EmailService {
    config: any = {};
    nodemailer: any;
    emailSender: string;

    constructor() {
        const emailSender = process.env.EMAIL_SENDER;
        const emailSenderPassword = process.env.EMAIL_SENDER_PASSWORD;
        const emailSmtpHost = process.env.EMAIL_SMTP_HOST;
        const emailSmtpPort = process.env.EMAIL_SMTP_PORT;
        const emailSmtpSecure = process.env.EMAIL_SMTP_SECURE;

        if (emailSender === null || !emailSender) throw new Error('emailSender is invalid.');
        if (emailSenderPassword === null || !emailSenderPassword) throw new Error('emailSenderPassword is invalid.');
        if (emailSmtpHost === null || !emailSmtpHost) throw new Error('emailSmtpHost is invalid.');
        if (emailSmtpPort === null || !emailSmtpPort) throw new Error('emailSmtpPort is invalid.');
        if (emailSmtpSecure === null || !emailSmtpSecure) throw new Error('emailSmtpSecure is invalid.');

        this.emailSender = emailSender;
        this.nodemailer = require('nodemailer');
        this.config = {
            host: emailSmtpHost,
            port: emailSmtpPort,
            secure: emailSmtpSecure,
            auth: {
                user: emailSender,
                pass: emailSenderPassword,
            },
        };
    }

    public async send(to: string, subject: string, html: string) {
        const transporter = this.nodemailer.createTransport(this.config);
        await transporter.sendMail({
            from: this.emailSender,
            to,
            subject,
            html,
        });
    }
}