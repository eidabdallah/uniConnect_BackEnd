import nodemailer from 'nodemailer';

export async function sendEmail(to, subject, html) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.AdminEmail,
            pass: process.env.Password_Email_Sender,
        },
    });
    const info = await transporter.sendMail({
        from: `uniConnect <${process.env.AdminEmail}>`,
        to,
        subject,
        html,
    });
}
