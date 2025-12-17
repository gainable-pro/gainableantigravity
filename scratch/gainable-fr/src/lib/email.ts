
import { Resend } from 'resend';

// Use env var or allowed test key if not set (for dev without env)
// Note: In prod, strict env check is needed.
const resendApiKey = process.env.RESEND_API_KEY || 're_123456789';

const resend = new Resend(resendApiKey);

// Generic Email Sender
export async function sendEmail({
    to,
    subject,
    html,
    text
}: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("⚠️ RESEND_API_KEY not set. Email simulation:", { to, subject });
        return { success: true, simulated: true };
    }

    try {
        const data = await resend.emails.send({
            from: 'Gainable.fr <ne-pas-repondre@resend.dev>', // Use generic sender for testing
            to,
            subject,
            html,
            text
        });
        return { success: true, data };
    } catch (error) {
        console.error("Resend Error:", error);
        return { success: false, error };
    }
}
