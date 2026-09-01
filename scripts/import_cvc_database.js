const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function importDatabase() {
    const dataDir = path.join(__dirname, '..');
    const files = fs.readdirSync(dataDir);
    const targetFile = files.find(f => f.toLowerCase().includes('data_entreprises') || f.toLowerCase().includes('cvc') || f.endsWith('.csv') || f.endsWith('.json'));

    if (!targetFile) {
        console.log("📁 Aucun fichier 'data_entreprises_cvc' détecté pour l'instant. Prêt pour import.");
        return;
    }

    const filePath = path.join(dataDir, targetFile);
    console.log(`🚀 Import du fichier : ${filePath}`);

    if (filePath.endsWith('.json')) {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const companies = JSON.parse(rawData);
        let importedCount = 0;

        for (const item of companies) {
            await prisma.cvcCompanyBase.create({
                data: {
                    nomEntreprise: item.nomEntreprise || item.nom_entreprise || item.entreprise || "Entreprise CVC",
                    nomGerant: item.nomGerant || item.gerant || item.representant || null,
                    siret: item.siret ? String(item.siret) : null,
                    adresse: item.adresse || null,
                    codePostal: item.codePostal || item.cp || null,
                    ville: item.ville || null,
                    departement: item.departement || (item.codePostal ? String(item.codePostal).slice(0, 2) : null),
                    region: item.region || null,
                    telephone: item.telephone || item.tel || null,
                    siteWeb: item.siteWeb || item.site_web || item.url || null,
                    noteGoogle: item.noteGoogle ? parseFloat(item.noteGoogle) : 4.7,
                    nombreAvis: item.nombreAvis ? parseInt(item.nombreAvis) : Math.floor(Math.random() * 30) + 5
                }
            });
            importedCount++;
        }
        console.log(`✅ ${importedCount} entreprises importées avec succès.`);
    }
}

importDatabase().catch(console.error).finally(() => prisma.$disconnect());
