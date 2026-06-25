const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `PR Peptides <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html
    });
    return true;
  } catch (err) {
    console.error('Email error:', err.message);
    return false;
  }
};

exports.orderConfirmationHTML = (order) => `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#0a0e1a;color:#fff;padding:40px">
  <div style="max-width:600px;margin:0 auto;background:#0d1526;border-radius:12px;padding:40px;border:1px solid #1e3a5f">
    <h1 style="color:#3b82f6;margin-bottom:8px">PR Peptides</h1>
    <p style="color:#94a3b8;margin-bottom:32px">Order Confirmation</p>
    <h2 style="color:#fff">Order #${order.orderNumber}</h2>
    <p style="color:#cbd5e1">Thank you, ${order.customer.name}! Your order has been received.</p>
    <div style="background:#1e3a5f;border-radius:8px;padding:20px;margin:24px 0">
      ${order.items.map(item => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #2d5a8e">
          <span>${item.name} (${item.dosage})</span>
          <span>$${item.price} x ${item.quantity}</span>
        </div>
      `).join('')}
      <div style="display:flex;justify-content:space-between;padding-top:16px;font-weight:bold;font-size:18px">
        <span>Total</span><span style="color:#3b82f6">$${order.total}</span>
      </div>
    </div>
    <p style="color:#94a3b8;font-size:13px">For research use only. Not for human consumption.</p>
  </div>
</body>
</html>`;

exports.notificationEmailHTML = (notification) => `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#0a0e1a;color:#fff;padding:40px">
  <div style="max-width:600px;margin:0 auto;background:#0d1526;border-radius:12px;padding:40px;border:1px solid #1e3a5f">
    <h1 style="color:#3b82f6">PR Peptides</h1>
    <h2 style="color:#fff">${notification.title}</h2>
    <p style="color:#cbd5e1">${notification.message}</p>
    <a href="${process.env.CLIENT_URL}" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Visit Store</a>
  </div>
</body>
</html>`;
