'use server';

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function cancelSubscriptionAction(subscriptionId: string) {
    try {
        if (!subscriptionId) throw new Error("ID d'abonnement manquant");

        // 1. Retrieve Subscription from Stripe
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        if (!sub) throw new Error("Abonnement introuvable chez Stripe");

        // 2. Logic: 12-Month Commitment Check
        const startDate = new Date(sub.created * 1000);
        const now = new Date();

        // Calculate Anniversary (Creation Date + 1 Year)
        const anniversaryDate = new Date(startDate);
        anniversaryDate.setFullYear(startDate.getFullYear() + 1);

        // Calculate Window Start (Anniversary - 1 Month)
        const cancellationWindowStart = new Date(anniversaryDate);
        cancellationWindowStart.setMonth(anniversaryDate.getMonth() - 1);

        // Allow if we are PAST the window start OR if manually overridden (optional)
        // STRICT CHECK:
        if (now < cancellationWindowStart) {
            throw new Error(`Engagement de 12 mois en cours. Résiliation possible à partir du ${cancellationWindowStart.toLocaleDateString('fr-FR')}.`);
        }

        // 3. Perform Cancellation (At Period End)
        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true
        });

        // 4. Update Database Status Sync (Optional, webhook will do it effectively but good for UI feedback)
        await prisma.subscription.update({
            where: { stripeId: subscriptionId },
            data: { status: 'active' } // Status remains active until actual end, but we might want to flag pending cancellation if we had a field.
        });

        revalidatePath('/dashboard/factures');
        return { success: true, message: "Demande de résiliation prise en compte. L'abonnement s'arrêtera à la date anniversaire." };

    } catch (error: any) {
        console.error("Cancellation Error:", error);
        return { success: false, error: error.message };
    }
}
