


export { };

async function main() {
    const payload = {
        email: "test.diagnostiqueur@example.com",
        password: "Password123!",
        representativeName: "Jean Test",
        nomEntreprise: "Diag Test SARL",
        expertType: "diagnostiqueur",
        adresse: "123 Rue Test",
        ville: "Paris",
        codePostal: "75001",
        pays: "fr",
        siret: "12345678901234",
        codeApe: "7112B",
        description: "Test description",
        interventionsDiag: ["dpe", "amiante"], // Example values
        role: "PRO"
    };

    console.log("Sending payload:", payload);

    try {
        const res = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Data:", data);
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

main();
