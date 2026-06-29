import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "./constant";
import { HttpException } from "../exceptions/http-exception";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new HttpException(
      500,
      "Email is not configured. Add EMAIL_USER and EMAIL_PASS to backend/.env",
    );
  }

  await transporter.sendMail({
    from: `Yeti Trek <${EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
