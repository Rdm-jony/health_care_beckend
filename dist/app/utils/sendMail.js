/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { envVars } from "../config/env.js";
import path from "path";
import ejs from "ejs";
import AppError from "../errorHelpers/AppError.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const transporter = nodemailer.createTransport({
    host: envVars.MAIL_SENDER.SMTP_HOST,
    port: Number(envVars.MAIL_SENDER.SMTP_PORT),
    secure: true,
    auth: {
        user: envVars.MAIL_SENDER.SMTP_USER,
        pass: envVars.MAIL_SENDER.SMTP_PASS
    }
});
export const sendMail = async ({ to, subject, templateName, templateData, attachments, }) => {
    try {
        const templatePath = path.join(__dirname, `ejsTemplate/${templateName}.ejs`);
        const html = await ejs.renderFile(templatePath, templateData);
        const info = await transporter.sendMail({
            from: envVars.MAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        });
        console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
    }
    catch (error) {
        throw new AppError(401, error.message);
    }
};
