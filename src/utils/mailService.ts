import {
    EMAIL_FROM,
    ENV,
    MAILTRAP_HOST,
    MAILTRAP_PASS,
    MAILTRAP_PORT,
    MAILTRAP_USER,
    SENDGRID_PASSWORD,
    SENDGRID_USERNAME,
} from '@/config';
import { MailTemplate } from '@/types';
import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';
import createHttpError from 'http-errors';
import { htmlToText } from 'html-to-text';

interface MailData {
    subject: string;
    [key: string]: any;
}

export class MailService {
    private mailLayout = path.join(
        __dirname,
        '../views/emails/layout-email.ejs'
    );

    constructor(private email: string, private data: MailData) {}

    private createTransport() {
        if (ENV === 'development') {
            return nodemailer.createTransport({
                host: MAILTRAP_HOST,
                port: MAILTRAP_PORT,
                auth: {
                    user: MAILTRAP_USER,
                    pass: MAILTRAP_PASS,
                },
            });
        }

        return nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: SENDGRID_USERNAME,
                pass: SENDGRID_PASSWORD,
            },
        });
    }

    private async sendMail(template: MailTemplate) {
        try {
            const html = await ejs.renderFile(this.mailLayout, {
                ...this.data,
                template,
            });

            const mailOptions = {
                from: EMAIL_FROM,
                to: this.email,
                subject: this.data.subject,
                html,
                text: htmlToText(html),
            };

            const transporter = this.createTransport();

            await transporter.sendMail(mailOptions);
        } catch (error) {
            throw createHttpError(
                500,
                'There was an error when sending the email. Try again later!'
            );
        }
    }

    sendResetPassword() {
        return this.sendMail(MailTemplate.RESET_PASSWORD);
    }
}
