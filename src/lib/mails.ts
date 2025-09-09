import nodemailer from 'nodemailer';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
// Email configuration using Brevo (Sendinblue)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT) || 0,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})


export const sendContactEmail = async (data: ContactFormData) => {

  const mailOptions = {
    from: `${process.env.EMAIL_FROM}`,
    to: `mijudramainfo@gmail.com`,
    subject: `New Contact Form Submission from ${data.name}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; font-size: 28px; margin: 0; font-weight: 600;">New Contact Message</h1>
          <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #2563eb, #3b82f6); margin: 15px auto; border-radius: 2px;"></div>
        </div>
        
        <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #2563eb;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">
          New Contact Form Submission
          </h2>
        
          <div style="display: grid; gap: 15px;">
            <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #2563eb, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <span style="color: white; font-weight: bold; font-size: 16px;">👤</span>
              </div>
              <div>
                <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Name</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${data.name}</p>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #059669, #10b981); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <span style="color: white; font-weight: bold; font-size: 16px;">✉️</span>
              </div>
              <div>
                <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${data.email}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style="margin: 25px 0;">
          <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
            <span style="margin-right: 10px;">💬</span> Message
          </h3>
          <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <p style="margin: 0; color: #374151; line-height: 1.6; font-size: 15px;">
            ${data.message.replace(/\n/g, '<br>')}
            </p>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #f1f5f9; text-align: center;">
          <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">📧 Sent from your website contact form</p>
          <p style="margin: 0; color: #94a3b8; font-size: 12px;">🕒 ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `,
    text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}

Timestamp: ${new Date().toLocaleString()}
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};