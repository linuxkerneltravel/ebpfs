export default class EmailService {
    config: any = {};
    nodemailer: any;

    constructor(
        public emailSender: string,
        public emailSenderPassword: string,
        public emailSmtpHost: string,
        public emailSmtpPort: string,
        public emailSmtpSecure: boolean,
    ) {
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