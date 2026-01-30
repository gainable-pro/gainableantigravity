import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { BillingView } from "./billing-view";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded.userId;
    } catch {
        return null;
    }
}

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
    const userId = await getUserId();
    if (!userId) {
        redirect("/");
    }

    // 1. Get Expert & Stripe Customer ID
    const expert = await prisma.expert.findUnique({
        where: { user_id: userId },
        select: { id: true, stripeCustomerId: true }
    });

    if (!expert || !expert.stripeCustomerId) {
        return (
            <div className="p-8 text-center bg-white rounded-lg border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Aucun abonnement détecté</h2>
                <p className="text-slate-500">
                    Votre compte n'est pas encore lié à un profil de facturation Stripe actif.
                    <br />
                    Si vous venez de vous abonner, patientez quelques minutes ou contactez le support.
                </p>
            </div>
        );
    }

    // 2. Fetch Stripe Data in Parallel
    const [invoicesRes, subscriptionsRes] = await Promise.all([
        stripe.invoices.list({
            customer: expert.stripeCustomerId,
            limit: 24, // Last 2 years approx
        }),
        stripe.subscriptions.list({
            customer: expert.stripeCustomerId,
            status: 'all',
            limit: 1
        })
    ]);

    const subscription = subscriptionsRes.data[0];
    const invoices = invoicesRes.data;

    // Handle "No Subscription" case (e.g. deleted on Stripe but ID remains)
    if (!subscription) {
        return (
            <div className="p-8 text-center bg-white rounded-lg border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Pas d'abonnement actif</h2>
                <p className="text-slate-500 mb-4">
                    Aucun abonnement actif n'a été trouvé pour votre compte client.
                </p>
                {invoices.length > 0 && (
                    <BillingView invoices={invoices} subscription={{ status: 'canceled', created: 0, current_period_end: 0 } as any} />
                )}
            </div>
        );
    }

    return (
        <BillingView
            invoices={invoices}
            subscription={subscription}
        />
    );
}
