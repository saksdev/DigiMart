import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPaymentEmail = async ({ email, reference, orderId, product }) => {
  await transporter.sendMail({
    from: `"UPI Store" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Payment Submitted',
    html: `
      <h3>New Payment Received</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Product:</strong> ${product?.title || 'N/A'}</p>
    `,
  });
};
