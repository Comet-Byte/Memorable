import { env } from "@invoicely/utilities";
import nodemailer from "nodemailer";

// Gmail SMTP transport. Requires a Google App Password (not the account password).
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
}

// Thin wrapper around Gmail SMTP for transactional auth emails (verification, password reset).
export const sendEmail = async ({ to, subject, text }: SendEmailOptions) => {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    text,
  });
};
