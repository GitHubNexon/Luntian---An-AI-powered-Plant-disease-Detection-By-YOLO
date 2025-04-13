require("dotenv").config();
const nodemailer = require("nodemailer");
const useragent = require("express-useragent");

async function sendLoginNotification(email, loginDetails, previousLogin) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let subject, text;

  // If there is no previous login or the login is from a new device, send the email.
  if (
    !previousLogin ||
    previousLogin.device !== loginDetails.device ||
    previousLogin.os !== loginDetails.os ||
    previousLogin.browser !== loginDetails.browser
  ) {
    subject = previousLogin ? "New Login Detected" : "Login Successful";
    text = `You have successfully logged in from the following device:\n
      - IP Address: ${loginDetails.ip}
      - Device: ${loginDetails.device}
      - OS: ${loginDetails.os}
      - Browser: ${loginDetails.browser}
      - Time: ${loginDetails.loginTime}\n
      If this wasn't you, please change your password immediately.`;
  } else {
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Login notification email sent to", email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { sendLoginNotification };
