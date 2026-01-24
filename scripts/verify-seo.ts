
import { generateExpertMetaTitle, generateExpertMetaDescription } from "../src/lib/seo-templates";
import { getDepartmentFromZip } from "../src/lib/departments";

const mockExpert = {
    nomEntreprise: "Clim Pro 31",
    ville: "Toulouse",
    codePostal: "31000",
    description: "Installateur expérimenté à Toulouse."
};

console.log("--- TEST DEPARTMENTS ---");
const dept = getDepartmentFromZip("31000");
console.log(`Zip 31000 -> ${dept} (Expected: Haute-Garonne)`);

console.log("\n--- TEST SEO TEMPLATES (Existing/Fallback) ---");
const title = generateExpertMetaTitle(mockExpert);
console.log("Generated Title:", title);
// Expected: Clim Pro 31 – Climatisation Réversible & Gainable à Toulouse (Haute-Garonne)

const desc = generateExpertMetaDescription(mockExpert);
console.log("Generated Desc:", desc);
// Expected: Clim Pro 31, spécialiste en climatisation gainable à Toulouse...

if (title.includes("Toulouse") && title.includes("Haute-Garonne") && title.includes("Gainable")) {
    console.log("✅ Title Validated");
} else {
    console.error("❌ Title Validation Failed");
}

if (desc.includes("Toulouse") && desc.includes("gainable")) {
    console.log("✅ Description Validated");
} else {
    console.error("❌ Description Validation Failed");
}
