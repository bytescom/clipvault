import nodemailer from "nodemailer";

const BRAND = {
    name: "ClipVault",
    accent: "#ff5d5d",
    accentDark: "#e04848",
};

const EXPIRY_TEXT = process.env.RESET_LINK_EXPIRY_TEXT || "1 hour";
const isProd = process.env.NODE_ENV === "production";

// Reuse one transporter instead of creating a new one per email.
let cachedTransporter;

function getTransporter() {
    if (cachedTransporter !== undefined) return cachedTransporter;

    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");

    cachedTransporter =
        user && pass
            ? nodemailer.createTransport({
                  service: "gmail",
                  auth: { user, pass },
              })
            : null;

    return cachedTransporter;
}

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function buildResetUrl({ url, token }) {
    const base = (
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.BETTER_AUTH_URL ||
        "http://localhost:3000"
    ).replace(/\/+$/, "");

    return {
        base,
        resetUrl: token
            ? `${base}/auth/reset-password?token=${encodeURIComponent(token)}`
            : url,
        isLocalhost: /localhost|127\.0\.0\.1/.test(base),
    };
}

function renderHtml({ resetUrl, isLocalhost }) {
    const safeUrl = escapeHtml(resetUrl);

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Reset your ${BRAND.name} password</title>
    <style>
        @media (prefers-color-scheme: dark) {
            .bg-page { background-color: #0f1115 !important; }
            .bg-card { background-color: #1a1d23 !important; }
            .text-main { color: #f3f4f6 !important; }
            .text-muted { color: #9ca3af !important; }
            .box-link { background-color: #232730 !important; border-color: #2f343f !important; }
            .divider { border-color: #2f343f !important; }
        }
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .px { padding-left: 24px !important; padding-right: 24px !important; }
        }
    </style>
</head>
<body class="bg-page" style="margin:0; padding:0; background-color:#f4f5f7; -webkit-text-size-adjust:100%;">

    <!-- Preheader (inbox preview text) -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
        Use this link to reset your ${BRAND.name} password. It expires in ${EXPIRY_TEXT}.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-page" style="background-color:#f4f5f7;">
        <tr>
            <td align="center" style="padding:40px 16px;">

                <table role="presentation" class="container" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px; max-width:560px;">

                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding:0 0 24px 0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; font-size:24px; font-weight:800; letter-spacing:-0.5px; color:#111827;" class="text-main">
                            Clip<span style="color:${BRAND.accent};">Vault</span>
                        </td>
                    </tr>

                    <!-- Card -->
                    <tr>
                        <td class="bg-card px" style="background-color:#ffffff; border-radius:12px; padding:40px 40px 32px 40px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

                            <h1 class="text-main" style="margin:0 0 12px 0; font-size:22px; line-height:30px; font-weight:700; color:#111827;">
                                Reset your password
                            </h1>

                            <p class="text-muted" style="margin:0 0 28px 0; font-size:15px; line-height:24px; color:#4b5563;">
                                We received a request to reset the password for your ${BRAND.name} account.
                                Click the button below to choose a new one. This link expires in <strong>${EXPIRY_TEXT}</strong>.
                            </p>

                            <!-- Bulletproof button -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 28px auto;">
                                <tr>
                                    <td align="center" bgcolor="${BRAND.accent}" style="border-radius:8px;">
                                        <a href="${safeUrl}" target="_blank"
                                           style="display:inline-block; padding:14px 36px; font-size:15px; font-weight:600; line-height:20px; color:#ffffff; text-decoration:none; border-radius:8px; background-color:${BRAND.accent};">
                                            Reset password
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Fallback link -->
                            <p class="text-muted" style="margin:0 0 8px 0; font-size:13px; line-height:20px; color:#6b7280;">
                                Button not working? Copy and paste this link into your browser:
                            </p>
                            <div class="box-link" style="background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:12px 14px; margin:0 0 24px 0; font-size:12px; line-height:18px; word-break:break-all;">
                                <a href="${safeUrl}" style="color:#2563eb; text-decoration:underline;">${safeUrl}</a>
                            </div>

                            ${
                                isLocalhost
                                    ? `<div style="background-color:#fffbeb; border:1px solid #fcd34d; border-radius:8px; padding:12px 14px; margin:0 0 24px 0; font-size:12px; line-height:18px; color:#92400e;">
                                <strong>Dev note:</strong> this link points to <code>localhost</code> and will only open on the machine running your dev server.
                            </div>`
                                    : ""
                            }

                            <hr class="divider" style="border:none; border-top:1px solid #e5e7eb; margin:0 0 20px 0;">

                            <p class="text-muted" style="margin:0; font-size:13px; line-height:20px; color:#6b7280;">
                                If you didn't request this, you can safely ignore this email &mdash; your password won't change.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" class="text-muted" style="padding:24px 16px 0 16px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; font-size:12px; line-height:18px; color:#9ca3af;">
                            &copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.<br>
                            This is an automated message, please don't reply.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

function renderText(resetUrl) {
    return [
        `Reset your ${BRAND.name} password`,
        "",
        `We received a request to reset your password. Open the link below to choose a new one (expires in ${EXPIRY_TEXT}):`,
        "",
        resetUrl,
        "",
        "If you didn't request this, you can safely ignore this email.",
        "",
        `— The ${BRAND.name} Team`,
    ].join("\n");
}

/**
 * Sends a password reset email via Gmail SMTP using Nodemailer.
 */
export async function sendPasswordResetEmail({ to, url, token }) {
    const transporter = getTransporter();
    const { resetUrl, isLocalhost } = buildResetUrl({ url, token });

    if (!transporter) {
        console.warn("[email] SMTP_USER or SMTP_PASS missing in .env.");
        // Never log reset links in production (they grant account access).
        if (!isProd) console.warn(`[email] Reset link for ${to}:\n${resetUrl}`);
        return false;
    }

    const from =
        process.env.SMTP_FROM || `"${BRAND.name}" <${process.env.SMTP_USER}>`;

    try {
        await transporter.sendMail({
            from,
            to,
            subject: `Reset your ${BRAND.name} password`,
            text: renderText(resetUrl),
            html: renderHtml({ resetUrl, isLocalhost }),
        });
        console.log(`[email] Password reset email sent to ${to}`);
        return true;
    } catch (error) {
        console.error(`[email] Failed to send password reset email to ${to}:`, error);
        if (!isProd) console.warn(`[email] Fallback reset link:\n${resetUrl}`);
        throw error;
    }
}