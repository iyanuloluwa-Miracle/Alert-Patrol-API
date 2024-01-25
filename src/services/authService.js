// services/authService.js
const mailgun = require("mailgun-js");
const argon2 = require("argon2");
//const User = require("../Models/users");

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const hashFunction = async (data) => {
  return argon2.hash(data);
};

const generateResetToken = async () => {
  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const hash = await hashFunction(token);
  return { token, hash };
};

const validateResetToken = (savedTokenHash, inputToken) => {
  return argon2.verify(savedTokenHash, inputToken);
};

const sendResetTokenByEmail = async (email, resetToken) => {
  try {
    const data = {
      from: "Alert-patrol@gmail.com", // replace with your sender email
      to: email,
      subject: "Password Reset",
      text: `Here is your password reset Password: ${resetToken}\n\nPlease copy this token and use it in the password reset form on our website.`,
    };

    await mg.messages().send(data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendSuccessfulPurchaseEmail = async(email, Body) => {
  try {
    const data = {
      from: "Alert-patrol@gmail.com", // replace with your sender email
      to: email,
      subject: "Purchase Successful",
      text: `Your purchase was successful. Transaction Ref ${Body.transaction_ref}. Amount ${Body.amount/100}`,
    };

    await mg.messages().send(data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

const sendVerificationEmail = async (email, verificationLink, username) => {
  try {
    const data = {
      from: "Alert-patrol@gmail.com", // replace with your sender email
      to: email,
      subject: "Unicon Account Verification",
      text: `
       Dear ${username}, thank you for creating an account with Unicon. Kindly verify your email address by clicking on the link below.  
       ${verificationLink}             
      `,
    };

    await mg.messages().send(data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  generateResetToken,
  validateResetToken,
  sendResetTokenByEmail,
  sendVerificationEmail,
  sendSuccessfulPurchaseEmail
};
