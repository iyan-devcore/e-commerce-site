import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    }
});

export const sendVerificationLink = async (email, verificationUrl) => {
    try {
        const mailOptions = {
            from: `"TechStore" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email - TechStore',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 32px 24px; text-align: center;">
                        <h1 style="color: white; font-size: 24px; margin: 0; font-weight: 700;">Verify Your Email Address</h1>
                    </div>
                    <div style="padding: 36px 32px;">
                        <p style="color: #374151; font-size: 16px; margin: 0 0 16px;">Hello,</p>
                        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
                            Thank you for creating an account with <strong style="color: #2563eb;">TechStore</strong>! 
                            To complete your registration, please click the button below to verify your email address.
                        </p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${verificationUrl}" 
                               style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; box-shadow: 0 4px 14px rgba(37,99,235,0.4);">
                                ✓ Verify My Email
                            </a>
                        </div>
                        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 20px 0 0;">
                            This link expires in <strong>24 hours</strong>. If you didn't create an account, you can safely ignore this email.
                        </p>
                        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 28px 0;" />
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                            If the button doesn't work, copy and paste this URL into your browser:<br/>
                            <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
                        </p>
                    </div>
                    <div style="background: #f9fafb; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2025 TechStore. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Verification link email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending verification link email:', error);
        return false;
    }
};
