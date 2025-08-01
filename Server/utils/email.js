const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendPaymentNotification(payment) {
  const mailOptions = {
    from: `"Payment System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Payment Received - Order ID: ${payment._id}`,
    html: `
      <h3>New Payment Details</h3>
      <p><b>User:</b> ${payment.userEmail}</p>
      <p><b>Amount:</b> ₹${payment.amount}</p>
      <p><b>Reference ID:</b> ${payment.referenceId}</p>
      <p><b>Status:</b> ${payment.status}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendPaymentNotification };
