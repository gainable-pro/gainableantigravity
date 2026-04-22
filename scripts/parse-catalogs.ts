import fs from 'fs';
import path from 'path';
import PDFParser from 'pdf2json';

const pdfDir = path.join(process.cwd(), 'catalogues-pdf');
const outputFile = path.join(process.cwd(), 'src', 'data', 'raw-products.json');

async function parseAll() {
    const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
    const allProducts = [];

    for (const file of files) {
        console.log(`Analyzing ${file}...`);
        try {
            const rawText = await extractTextFromPdf(path.join(pdfDir, file));
            const products = runHeuristics(rawText, file);
            allProducts.push(...products);
            console.log(`Found ${products.length} potential models in ${file}.`);
        } catch(e) {
            console.error(`Error parsing ${file}:`, e);
        }
    }

    // Filter duplicates across the entire array
    const uniqueProducts = [];
    const seen = new Set();
    for (const p of allProducts) {
        if (!seen.has(p.model)) {
            seen.add(p.model);
            uniqueProducts.push(p);
        }
    }

    fs.writeFileSync(outputFile, JSON.stringify(uniqueProducts, null, 2), 'utf8');
    console.log(`\nDONE! Saved ${uniqueProducts.length} unique products to raw-products.json`);
}

function extractTextFromPdf(pdfPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1);
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
            const text = pdfParser.getRawTextContent();
            resolve(text);
        });
        pdfParser.loadPDF(pdfPath);
    });
}

function runHeuristics(text: string, filename: string) {
    const products = [];
    let brand = "Système";
    
    if (filename.toLowerCase().includes('daikin') || text.match(/\bdaikin\b/i)) brand = "Daikin";
    else if (filename.toLowerCase().includes('mitsubishi') || text.match(/\bmitsubishi\b/i)) brand = "Mitsubishi";
    else if (filename.toLowerCase().includes('hitachi') || text.match(/\bhitachi\b/i)) brand = "Hitachi";
    else if (filename.toLowerCase().includes('atlantic') || text.match(/\batlantic\b/i)) brand = "Atlantic";
    else if (filename.toLowerCase().includes('gree') || text.match(/\bgree\b/i)) brand = "Gree";
    else if (filename.toLowerCase().includes('heiwa') || text.match(/\bheiwa\b/i)) brand = "Heiwa";
    else if (filename.toLowerCase().includes('airzone') || text.match(/\bairzone\b/i)) brand = "Airzone";

    const lines = text.split('\n');
    
    // Heuristic Regex: Looks for typical HVAC model names (e.g. PUZ-ZM, PEAD-M, MSZ-LN)
    // Most model names have 2-4 uppercase letters, a dash, and some alphanumeric chars
    const modelRegex = /\b([A-Z]{2,4}[-][A-Z0-9]{2,6})\b/g;

    const keywords = ['Gainable', 'Mural', 'Console', 'Cassette', 'Plafonnier', 'VRV', 'DRV', 'Multisplit', 'Pompe à chaleur', 'Chauffe-eau'];

    lines.forEach((line, index) => {
        const match = line.match(modelRegex);
        if (match) {
            match.forEach(m => {
                if (m.length > 5 && !products.find(p => p.model === m)) {
                    // Grab contextual lines
                    const contextStart = Math.max(0, index - 8);
                    const contextEnd = Math.min(lines.length - 1, index + 8);
                    const context = lines.slice(contextStart, contextEnd).join(' ');
                    
                    let type = "Climatisation Réversible";
                    for(const kw of keywords) {
                        if (context.match(new RegExp(kw, 'i'))) {
                            type = kw;
                            break; // Take the first matched keyword as type
                        }
                    }

                    const features = [];
                    if (context.match(/\bR32\b/i)) features.push("Gaz R32 écologique");
                    if (context.match(/\bR410A\b/i)) features.push("Gaz R410A");
                    if (context.match(/Hyper Heating|Hyper-Heating/i)) features.push("Hyper Heating");
                    if (context.match(/Inverter/i)) features.push("Technologie Inverter");
                    if (context.match(/Wi-Fi|Wifi|Smartphone/i)) features.push("Contrôle Wi-Fi");
                    if (context.match(/Silencieux|Silence/i)) features.push("Ultra Silencieux");

                    products.push({
                        brand,
                        model: m,
                        type,
                        features: [...new Set(features)],
                        // sourceFile: filename
                    });
                }
            });
        }
    });

    return products;
}

parseAll();
