import nodemailer from "nodemailer";

/**
 * Sends an OTP verification email via SMTP (Google SMTP by default).
 *
 * Reads SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD from the environment.
 * Unlike lib/sendmail.ts, this intentionally does NOT swallow errors — the caller
 * (Better Auth's sendVerificationOTP) relies on a thrown error to surface a failed
 * send to the client instead of silently returning a 200.
 */
export async function sendOtpEmail({
  email,
  otp,
}: {
  email: string;
  otp: string;
}): Promise<void> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const port = Number(process.env.SMTP_PORT) || 465;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Please set SMTP_HOST, SMTP_USER and SMTP_PASSWORD."
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587/STARTTLS
    auth: { user, pass },
  });

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Memorable";
  const from = process.env.EMAIL_FROM
    ? `${appName} <${process.env.EMAIL_FROM}>`
    : `${appName} <${user}>`;

  await transporter.sendMail({
    from,
    to: email,
    subject: `Your verification code: ${otp}`,
    text: `Your one-time verification code is: ${otp}\n\nThis code expires in 5 minutes.\n\nIf you did not request this, please ignore this email.`,
  });
}
