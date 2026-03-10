import nodemailer from "nodemailer";
import FileShareEmail from "../emails/FileShareEmail.js";

export async function sendFileEmail(email, fileName, downloadLink) {

  const html = FileShareEmail(fileName, downloadLink);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "File shared with you",
    html: html,
  });

}