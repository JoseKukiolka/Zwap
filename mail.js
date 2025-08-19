// mail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,          // tu correo del .env
    pass: process.env.GMAIL_APP_PASSWORD,  // contraseña de aplicación (16 caracteres)
  },
});

export default transporter;
