import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.PASS_MAIL,
    pass: process.env.PASS_KEY,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = await transporter.sendMail({
    from: process.env.PASS_MAIL,
    to: to,
    subject: subject,
    text: text,
  });
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


export default sendEmail;
