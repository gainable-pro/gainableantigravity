
import { PrismaClient } from '@prisma/client'

// Test Pooler Host on Port 5432 with FULL USERNAME (Session Mode)
const prisma = new PrismaClient({
    datasources: {
        db: {
            // Note the full username: postgres.mppxucdjziuaovdfeknj
            url: "postgresql://postgres.mppxucdjziuaovdfeknj:Monamoure23012017@aws-1-eu-west-1.pooler.supabase.com:5432/postgres",
        },
    },
    log: ['info', 'error'],
})

async function main() {
    console.log('--- Diagnosis: Testing Pooler Host Port 5432 + Full Username ---')
    try {
        console.log('Attempting to connect...')
        await prisma.$connect()
        console.log('Connection successful!')

        const userCount = await prisma.user.count()
        console.log(`User count: ${userCount}`)

    } catch (e: any) {
        console.error('--- FAILURE ---')
        console.error('Message:', e.message)
        console.error('Code:', e.code)
    } finally {
        await prisma.$disconnect()
    }
}

main()
