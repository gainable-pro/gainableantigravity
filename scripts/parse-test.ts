import fs from 'fs';
import path from 'path';
const pdf = require('pdf-parse');

async function testParse() {
    const pdfDir = path.join(process.cwd(), 'catalogues-pdf');
    const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
    
    if (files.length === 0) {
        console.log("No PDFs found in catalogues-pdf directory.");
        return;
    }
    
    console.log(`Found ${files.length} PDFs. We will test parsing the first one: ${files[0]}`);
    
    const dataBuffer = fs.readFileSync(path.join(pdfDir, files[0]));
    
    try {
        const pdfParse = require('pdf-parse');
        const pdfFunc = pdfParse.default || pdfParse;
        const data = await pdfFunc(dataBuffer, { max: 10 }); // Only parse first 10 pages for test
        console.log("--- PARSE TEST SUCCESS ---");
        console.log(`PAGES: ${data.numpages}`);
        console.log(`INFO:`, data.info);
        console.log("--- PREVIEW OF TEXT ---");
        console.log(data.text.substring(0, 1500));
        console.log("------------------------");
    } catch (e) {
        console.error("Failed to parse PDF:", e);
    }
}

testParse();
