const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: console.log, 
  logger: true 
});

app.post('/send-email', async (req, res) => {
  const { to, subject, body } = req.body;

  const mailOptions = {
    from: `"Vcriate" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    text: body
  };

  try {
    console.log('Attempting to send email...');
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});