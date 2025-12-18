export { };

export { };

// Usage: npx ts-node scripts/manual-register.ts <SIRET> <TYPE> <EMAIL> <NAME>
// TYPE: societe | bureau_etude | diagnostiqueur

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 4) {
        console.log("Usage: npx ts-node scripts/manual-register.ts <SIRET> <TYPE> <EMAIL> <NAME>");
        process.exit(1);
    }

    const [siret, type, email, name] = args;

    console.log(`Fetching details for SIRET ${siret}...`);
    let company: any = {};
    try {
        const siretRes = await fetch(`http://localhost:3000/api/siret?siret=${siret}`);
        if (siretRes.ok) {
            company = await siretRes.json();
            console.log(`Found: ${company.nom} (${company.naf})`);
        } else {
            console.warn("SIRET not found, using defaults.");
        }
    } catch (e) {
        console.warn("SIRET fetch failed:", e);
    }

    const payload = {
        email,
        password: "Password123!",
        representativeName: "Jean Test",
        nomEntreprise: company.nom || name, // Use real name or arg
        expertType: type,
        adresse: company.adresse || "10 Rue de la Paix",
        ville: company.ville || "Paris",
        codePostal: company.code_postal || "75000",
        pays: "fr",
        siret: siret,
        codeApe: company.naf || "4322B", // Use real APE
        description: "Société de test créée via script",
        website: "https://test.com",

        // Type specific
        technologies: type === 'societe' ? ["pac_air_air"] : [],
        interventionsClim: type === 'societe' ? ["installation"] : [],
        interventionsDiag: type === 'diagnostiqueur' ? ["dpe"] : [],
        interventionsEtude: type === 'bureau_etude' ? ["audits_energetiques"] : [],
        batiments: ["maison_individuelle"]
    };

    console.log(`Registering ${name} (${type}) with SIRET ${siret}...`);

    try {
        const res = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log(`HTTP ${res.status}:`, data);

        if (res.ok) {
            console.log("✅ Success!");
        } else {
            console.log("❌ Failed.");
        }

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

main();
