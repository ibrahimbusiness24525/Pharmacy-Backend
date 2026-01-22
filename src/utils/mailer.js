import nodemailer from "nodemailer";

export async function sendOtpEmail({ to, otp }) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    throw new Error("Email service is not configured");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: user,
    to,
    subject: "Your Pharmacy OTP Code",
    text: `Your OTP code is: ${otp}\n\nThis code expires in 10 minutes.`,
  });
}


