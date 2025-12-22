const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'contact.smb13@gmail.com';
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            expert: {
                include: {
                    subscription: true,
                    invoices: true
                }
            }
        }
    });

    if (user) {
        console.log(`User found: ${user.email}`);
        if (user.expert) {
            console.log(`Expert Status: ${user.expert.status}`);
            console.log(`Stripe Customer ID: ${user.expert.stripeCustomerId}`);
            console.log(`Subscription:`, user.expert.subscription);
            console.log(`Invoices:`, user.expert.invoices);
        } else {
            console.log("No Expert profile found.");
        }
    } else {
        console.log("User not found.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
