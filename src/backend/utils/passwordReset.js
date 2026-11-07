const crypto = require("crypto");
const nodemailer = require("nodemailer");

const RESET_TOKEN_LIFETIME_MS = 15 * 60 * 1000;

function isEmailDeliveryConfigured() {
    return Boolean(
        process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS &&
        process.env.SMTP_FROM
    );
}

function createResetCredentials() {
    const token = crypto.randomBytes(32).toString("hex");
    return {
        token,
        tokenHash: crypto.createHash("sha256").update(token).digest("hex"),
        expiresAt: new Date(Date.now() + RESET_TOKEN_LIFETIME_MS),
    };
}

function getResetUrl(token) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return `${frontendUrl.replace(/\/+$/, "")}/forgot-password?token=${encodeURIComponent(token)}`;
}

async function sendPasswordResetEmail(email, token) {
    const resetUrl = getResetUrl(token);

    if (!isEmailDeliveryConfigured()) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("SMTP email delivery is not configured");
        }
        console.info(`Password reset link for ${email}: ${resetUrl}`);
        return;
    }

    const port = Number(process.env.SMTP_PORT || 587);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("SMTP_PORT must be a valid port number");
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Reset your Burger account password",
        text: `Use this link to reset your password. It expires in 15 minutes:\n\n${resetUrl}`,
        html: `<p>Use the link below to reset your password. It expires in 15 minutes.</p><p><a href="${resetUrl}">Reset password</a></p>`,
    });
}

function hashResetToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {
    createResetCredentials,
    hashResetToken,
    isEmailDeliveryConfigured,
    sendPasswordResetEmail,
};
