
import 'dotenv/config';
import { Client } from 'pg';

async function testConnection() {
    const url = process.env.DATABASE_URL;

    if (!url) {
        console.error("❌ DATABASE_URL is not defined in process.env");
        return;
    }

    try {
        // Parse URL to show debug info without showing password
        const parsed = new URL(url);
        console.log("--- Debug Info ---");
        console.log(`Protocol: ${parsed.protocol}`);
        console.log(`Host:     ${parsed.hostname}`);
        console.log(`Port:     ${parsed.port}`);
        console.log(`User:     ${parsed.username}`);
        console.log(`Password: ${parsed.password ? '****** (Present)' : '(Missing)'}`);
        console.log(`Database: ${parsed.pathname.substring(1)}`);
        console.log("------------------");

        const client = new Client({
            connectionString: url,
            ssl: { rejectUnauthorized: false }
        });

        console.log("Attempting to connect...");
        await client.connect();
        const res = await client.query('SELECT NOW()');
        console.log("✅ Connection SUCCESS!", res.rows[0]);
        await client.end();

    } catch (e: any) {
        console.error("❌ Connection FAILED:");
        console.error(`Code: ${e.code}`);
        console.error(`Message: ${e.message}`);

        if (e.code === '28P01') {
            console.error("\n💡 HINT: '28P01' means Password Authentication Failed.");
            console.error("- Check if your password contains special characters like #, @, /");
            console.error("- If so, they MUST be URL encoded (e.g., # -> %23, @ -> %40)");
        }
    }
}

testConnection();
