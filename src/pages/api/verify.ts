import {NextApiRequest, NextApiResponse} from "next";
import Message from "@/common/message";
import EmailService from "@/services/mail";
import {Token, TokenType} from "@/common/token";
import CacheService from "@/services/cache";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
    if (req.method === 'GET') {
        const emailSender = process.env.EMAIL_SENDER;
        const emailSenderPassword = process.env.EMAIL_SENDER_PASSWORD;
        const emailSmtpHost = process.env.EMAIL_SMTP_HOST;
        const emailSmtpPort = process.env.EMAIL_SMTP_PORT;
        const emailSmtpSecure = process.env.EMAIL_SMTP_SECURE;

        if (emailSender === null || !emailSender) {
            res.status(400).json(new Message(400, 'emailSender is invalid.', null));
            return;
        }

        if (emailSenderPassword === null || !emailSenderPassword) {
            res.status(400).json(new Message(400, 'emailSenderPassword is invalid.', null));
            return;
        }

        if (emailSmtpHost === null || !emailSmtpHost) {
            res.status(400).json(new Message(400, 'emailSmtpHost is invalid.', null));
            return;
        }

        if (emailSmtpPort === null || !emailSmtpPort) {
            res.status(400).json(new Message(400, 'emailSmtpPort is invalid.', null));
            return;
        }

        if (emailSmtpSecure === null || !emailSmtpSecure) {
            res.status(400).json(new Message(400, 'emailSmtpSecure is invalid.', null));
            return;
        }

        const sender = new EmailService(
            emailSender,
            emailSenderPassword,
            emailSmtpHost,
            emailSmtpPort,
            Boolean(emailSmtpSecure),
        );

        const code = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        const email = req.query.email;

        if (email === null || !email || typeof email !== 'string') {
            res.status(400).json(new Message(400, 'email is invalid.', null));
            return;
        }

        // 发送邮件
        await sender.send(email, 'Verify your email address', `Your verification code is ${code}.`);

        // 存入 Token
        const tokens = new CacheService<Token>();
        await tokens.set(code, new Token(
            code,
            email,
            TokenType.EMAIL_VERIFY_CODE,
            Date.now(),
            Date.now() + 1000 * 60 * 10));

        res.redirect('/verify');
    } else res.status(400).json(new Message(400, 'request method not match.', null));
}