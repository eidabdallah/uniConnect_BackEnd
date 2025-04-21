import { sendEmail } from "./sendEmail.js";
import jwt from 'jsonwebtoken';

export const sendConfirmEmail = async (email, userName, req) => {
  const token = jwt.sign({ email }, process.env.JWT_ConfirmEmail_SECRET, { expiresIn: 60 * 5 });
  const refreshToken = jwt.sign({ email }, process.env.JWT_ConfirmEmail_SECRET, { expiresIn: '1h' });

  const html = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%); border-radius: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.05);">        <div style="text-align: center; padding-bottom: 20px;">
          <img src="https://res.cloudinary.com/deylqxzgk/image/upload/c_thumb,w_200,g_face/v1745214611/image_px8lm1.jpg" 
               alt="${process.env.APPNAME} Logo" 
               style="width: 150px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-bottom: 15px;" />
          <h1 style="color: #1e3a8a; font-size: 30px; font-weight: 700; margin: 0; letter-spacing: 1px;">Hello, ${userName}!</h1>
        </div>
          <div style="background-color: #ffffff; border-radius: 15px; padding: 30px; text-align: center; position: relative; border: 1px solid #e0e7ff;">          <div style="position: absolute; top: 10px; left: 10px; opacity: 0.3;">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5" cy="5" r="3" fill="#60a5fa"/>
              <circle cx="25" cy="5" r="3" fill="#60a5fa"/>
              <circle cx="45" cy="5" r="3" fill="#60a5fa"/>
              <circle cx="5" cy="25" r="3" fill="#60a5fa"/>
              <circle cx="25" cy="25" r="3" fill="#60a5fa"/>
              <circle cx="45" cy="25" r="3" fill="#60a5fa"/>
              <circle cx="5" cy="45" r="3" fill="#60a5fa"/>
              <circle cx="25" cy="45" r="3" fill="#60a5fa"/>
              <circle cx="45" cy="45" r="3" fill="#60a5fa"/>
            </svg>
          </div>
  
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
            Welcome to <b style="color: #2563eb;">${process.env.APPNAME}</b>! We're so happy you're here.
          </p>
          <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 30px;">
            Just one quick step: confirm your email to start connecting with the world!
          </p>
            <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}" 
             style="display: inline-block; padding: 12px 40px; font-size: 16px; font-weight: 600; color: #ffffff; background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%); text-decoration: none; border-radius: 50px; box-shadow: 0 4px 15px rgba(37,99,235,0.3); transition: all 0.3s ease;">
             Confirm Email
          </a>
            <p style="font-size: 14px; color: #6b7280; margin: 30px 0 15px;">
            Didn’t get the email? 
            <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${refreshToken}" 
               style="color: #2563eb; text-decoration: none; font-weight: 500; border-bottom: 1px solid #2563eb;">
               Resend Confirmation
            </a>
          </p>
            <p style="font-size: 12px; color: #9ca3af; margin: 20px 0 0; line-height: 1.5;">
            This link is valid for 5 minutes. If this wasn't you, feel free to ignore this email.
          </p>
        </div>
          <div style="text-align: center; padding-top: 20px;">
          <p style="font-size: 12px; color: #6b7280; margin: 0;">
            © ${new Date().getFullYear()} ${process.env.APPNAME}. Let's Connect!
          </p>
        </div>
      </div>
    `;

  await sendEmail(email, 'Confirm Email', html);
};

export const sendConfirmationEmail = async (universityId, email, userName, req) => {
  const targetEmail = universityId.length === 8 ? `s${universityId}@stu.najah.edu` : (universityId.length === 4 ? email : null);

  if (targetEmail) {
    await sendConfirmEmail(targetEmail, userName, req);
  }
}

export const confirmEmailMessage = (name, res) => {
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%); border-radius: 20px; box-shadow: 0 8px 20px rgba(0,0,0,0.05);">
      <div style="text-align: center; padding-bottom: 20px;">
        <img src="https://res.cloudinary.com/deylqxzgk/image/upload/c_thumb,w_200,g_face/v1745214611/image_px8lm1.jpg" 
             alt="${process.env.APPNAME} Logo" 
             style="width: 150px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-bottom: 15px;" />
        <h1 style="color: #1e3a8a; font-size: 30px; font-weight: 700; margin: 0; letter-spacing: 1px;">Thank You, ${name}!</h1>
      </div>

      <div style="background-color: #ffffff; border-radius: 15px; padding: 30px; text-align: center; position: relative; border: 1px solid #e0e7ff;">
        <!-- Decorative Dots Pattern -->
        <div style="position: absolute; top: 10px; left: 10px; opacity: 0.3;">
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5" cy="5" r="3" fill="#60a5fa"/>
            <circle cx="25" cy="5" r="3" fill="#60a5fa"/>
            <circle cx="45" cy="5" r="3" fill="#60a5fa"/>
            <circle cx="5" cy="25" r="3" fill="#60a5fa"/>
            <circle cx="25" cy="25" r="3" fill="#60a5fa"/>
            <circle cx="45" cy="25" r="3" fill="#60a5fa"/>
            <circle cx="5" cy="45" r="3" fill="#60a5fa"/>
            <circle cx="25" cy="45" r="3" fill="#60a5fa"/>
            <circle cx="45" cy="45" r="3" fill="#60a5fa"/>
          </svg>
        </div>

        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
          Your email has been successfully confirmed! Welcome to <b style="color: #2563eb;">${process.env.APPNAME}</b>.
        </p>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 30px;">
          You're now ready to explore all the amazing features and connect with the world!
        </p>

        <p style="font-size: 14px; color: #6b7280; margin: 20px 0;">
          Need help? 
          <a href="mailto:support@${process.env.APPNAME.toLowerCase()}.com" 
             style="color: #2563eb; text-decoration: none; font-weight: 500; border-bottom: 1px solid #2563eb;">
             Contact Our Support Team
          </a>
        </p>
      </div>

      <div style="text-align: center; padding-top: 20px;">
        <p style="font-size: 12px; color: #6b7280; margin: 0;">
          © ${new Date().getFullYear()} ${process.env.APPNAME}. Let's Keep Connecting!
        </p>
      </div>
    </div>
  `;

  return res.send(html);
};