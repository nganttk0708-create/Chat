require('dotenv').config();
const nodemailer = require('nodemailer');

(async () => {
  const host = process.env.SMTP_HOST || 'localhost';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const from = process.env.EMAIL_FROM || user || 'test@example.com';
  const to = process.env.ADDITIONAL_RECIPIENTS || process.env.TEST_EMAIL || user || 'your-email@example.com';

  console.log('Testing SMTP connection with:');
  console.log({ host, port, user: user ? user.replace(/(.).+(@.+)/, '$1***$2') : '(none)' });

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: user && pass ? { user, pass } : undefined
    });

    // verify connection config
    await transporter.verify();
    console.log('SMTP connection successful. Sending test message...');

    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Test SMTP từ Chat app',
      text: 'Đây là email kiểm tra cấu hình SMTP.',
      html: '<p>Đây là email <b>kiểm tra</b> cấu hình SMTP.</p>'
    });

    console.log('Test email sent. Info:', info.messageId || info);
    console.log('If you used Ethereal, preview URL:', nodemailer.getTestMessageUrl(info) || '(none)');
  } catch (err) {
    console.error('SMTP test failed:', err && err.message ? err.message : err);
    if (err && err.code === 'ECONNREFUSED') console.error('Connection refused — kiểm tra SMTP_HOST, SMTP_PORT, hoặc firewall.');
  }
})();
