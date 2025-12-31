
import { Resend } from 'resend';

// Use env var or allowed test key if not set (for dev without env)
// Note: In prod, strict env check is needed.
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
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
        console.warn("⚠️ RESEND_API_KEY not set. Email simulation:", { to, subject });
        return { success: true, simulated: true };
    }

    const resend = new Resend(resendApiKey);

    try {
        const data = await resend.emails.send({
            from: 'Gainable.fr <contact@gainable.fr>', // Use generic sender for testing
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
