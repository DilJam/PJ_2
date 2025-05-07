const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendRecoveryEmail = async (toEmail, token) => {
  const resetUrl = `http://localhost:5000/reset_password.html?token=${token}`;

  const mailOptions = {
    from: `"Soporte App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Recuperación de contraseña",
    html: `<p>Haz clic en el siguiente enlace para recuperar tu contraseña:</p>
           <a href="${resetUrl}">${resetUrl}</a>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendRecoveryEmail };
