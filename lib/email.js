import nodemailer from "nodemailer";

function getTransporter() {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: user.trim(),
            pass: pass.replace(/\s+/g, ""),
        },
    });
}

/**
 * Sends a password reset email via Gmail SMTP using Nodemailer.
 * Falls back to console logging if SMTP_USER or SMTP_PASS are not configured.
 */
export async function sendPasswordResetEmail({ to, url }) {
    const transporter = getTransporter();

    if (!transporter) {
        console.warn(
            `[email] SMTP_USER or SMTP_PASS is missing in .env. Password reset link for ${to}:\n${url}`
        );
        return false;
    }

    const fromAddress = process.env.SMTP_FROM || `"ClipVault" <${process.env.SMTP_USER}>`;

    const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background-color: #f7fafc;">
        <div style="background-color: #ffffff; border: 3px solid #000000; border-radius: 16px; padding: 32px; box-shadow: 6px 6px 0px #000000;">
            <div style="margin-bottom: 24px;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; color: #000000;">
                    CLIP<span style="color: #ff5d5d;">VAULT</span>
                </h1>
            </div>

            <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 800; color: #000000;">
                Reset your password
            </h2>

            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.5; font-weight: 600; color: #1a202c;">
                We received a request to reset the password for your ClipVault account. Click the button below to choose a new password:
            </p>

            <div style="margin-bottom: 28px;">
                <a href="${url}" style="display: inline-block; background-color: #ff5d5d; color: #000000; font-size: 14px; font-weight: 900; text-transform: uppercase; text-decoration: none; padding: 14px 28px; border: 3px solid #000000; border-radius: 8px; box-shadow: 4px 4px 0px #000000;">
                    Reset Password
                </a>
            </div>

            <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #718096; text-transform: uppercase;">
                Or copy and paste this link:
            </p>
            <p style="margin: 0 0 24px 0; font-size: 12px; word-break: break-all; color: #3182ce;">
                <a href="${url}" style="color: #3182ce; text-decoration: underline;">${url}</a>
            </p>

            <div style="border-top: 2px solid #e2e8f0; padding-top: 16px;">
                <p style="margin: 0; font-size: 12px; font-weight: 600; color: #a0aec0;">
                    If you didn't request a password reset, you can safely ignore this email. The link will expire shortly.
                </p>
            </div>
        </div>
    </div>
    `;

    const text = `Reset your ClipVault password by visiting the link below:\n\n${url}\n\nIf you did not request a password reset, you can safely ignore this email.`;

    try {
        await transporter.sendMail({
            from: fromAddress,
            to,
            subject: "Reset your ClipVault password",
            text,
            html,
        });
        console.log(`[email] Password reset email sent successfully to ${to}`);
        return true;
    } catch (error) {
        console.error(`[email] Failed to send password reset email to ${to}:`, error);
        // Also log the URL in console as backup so the user isn't locked out in dev
        console.warn(`[email] Fallback reset link for ${to}:\n${url}`);
        throw error;
    }
}

