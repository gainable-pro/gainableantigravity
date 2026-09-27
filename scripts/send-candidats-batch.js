const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

// Load environment variables
const envFiles = ['.env.development.local', '.env.local', '.env.development', '.env'];
envFiles.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        dotenv.config({ path: filePath });
    }
});

const apiKey = process.env.RESEND_API_KEY;
console.log('RESEND_API_KEY present:', !!apiKey);

if (!apiKey) {
    console.error('CRITICAL: RESEND_API_KEY missing in environment variables.');
    process.exit(1);
}

const resend = new Resend(apiKey);

const recipients = [
    "gregory.hocquet@gmail.com",
    "Eva.verhaeghe10@icloud.com",
    "yvan.noreskal@gmail.com",
    "lenoirchristian12@gmail.com",
    "skoudakova@gmail.com",
    "ghislaina25@gmail.com",
    "victorianguyen@hotmail.fr",
    "globalecopower.sarl@gmail.com",
    "bilal.chadi90@gmail.com",
    "sabine_lasne@yahoo.fr",
    "samy.ellaouzi@gmail.com",
    "houimli.ameni@gmail.com",
    "lbservices83780@gmail.com",
    "tousobjets@gmail.com",
    "carolemondonnog5n_32m@indeedemail.com",
    "kounalo334@gmail.com",
    "musolinodeborah96@gmail.com",
    "coffolek@gmail.com",
    "anaisbianchiniwqwv8_f4v@indeedemail.com",
    "aurel.dar@gmail.com",
    "esteves.christoph@gmail.com",
    "dapvril.julien@hotmail.fr",
    "jnm@auralisipartners.fr",
    "rachidmoujaidov4hpms_upu@indeedemail.com",
    "odahmam_services@hotmail.com",
    "ssaletravailleur@gmail.com",
    "mathieu.rouger.dev@gmail.com",
    "uz.perez.professionnel@gmail.com",
    "nassimkhaldiocwhc_ipd@indeedemail.com",
    "casseusdarline@gmail.com",
    "conceicao.remi@gmail.com",
    "abcolak@hotmail.com",
    "Redirequoi@gmail.com",
    "jeanfrancois.framarin@gmail.com",
    "djamilabouhadjart6unc_puw@indeedemail.com",
    "cobret.marine@gmail.com",
    "geoffroy.pradier@icloud.com",
    "givert.jeremy@gmail.com",
    "Fiona.chiboub@hotmail.fr",
    "elodiegandit97@gmail.com",
    "bousselit.myriam@gmail.com",
    "marcos.richer@gmail.com"
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const htmlPath = path.join(process.cwd(), 'emails_marketing', 'email_candidats_commercial.html');
    if (!fs.existsSync(htmlPath)) {
        console.error(`HTML file not found at ${htmlPath}`);
        process.exit(1);
    }

    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const subject = 'Confirmation de candidature — Consultant Commercial B2B Indépendant | Gainable.fr';

    console.log(`Starting batch send for ${recipients.length} candidates...`);

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < recipients.length; i++) {
        const email = recipients[i].trim();
        console.log(`[${i + 1}/${recipients.length}] Sending to ${email}...`);

        try {
            const response = await resend.emails.send({
                from: 'Gainable.fr Recrutement <conseil@gainable.ch>',
                replyTo: 'contact@gainable.fr',
                to: email,
                subject: subject,
                html: htmlContent
            });

            if (response.error) {
                console.error(`❌ Failed [${email}]:`, response.error);
                failureCount++;
                results.push({ email, status: 'error', error: response.error, timestamp: new Date().toISOString() });
            } else {
                console.log(`✅ Success [${email}] ID: ${response.data.id}`);
                successCount++;
                results.push({ email, status: 'success', resendId: response.data.id, timestamp: new Date().toISOString() });
            }
        } catch (err) {
            console.error(`❌ Exception [${email}]:`, err.message || err);
            failureCount++;
            results.push({ email, status: 'error', error: err.message || String(err), timestamp: new Date().toISOString() });
        }

        // Small delay to respect rate limits
        await sleep(350);
    }

    console.log('\n========================================');
    console.log(`BATCH SEND COMPLETED: ${successCount} Successes, ${failureCount} Failures`);
    console.log('========================================\n');

    const logFile = path.join(process.cwd(), 'emails_marketing', 'candidats_batch_send_log.json');
    fs.writeFileSync(logFile, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`Detailed log written to ${logFile}`);
}

main();
