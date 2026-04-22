const fs = require('fs');
const path = require('path');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();

async function testParse() {
    const pdfDir = path.join(__dirname, '..', 'catalogues-pdf');
    if (!fs.existsSync(pdfDir)) {
        console.log("No directory found:", pdfDir);
        return;
    }
    const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
    
    if (files.length === 0) {
        console.log("No PDFs found.");
        return;
    }
    
    console.log(`Found ${files.length} PDFs. Testing: ${files[0]}`);
    
    const filePath = path.join(pdfDir, files[0]);
    try {
        const data = await pdfExtract.extract(filePath, { firstPage: 1, lastPage: 5 });
        console.log("--- PARSE TEST SUCCESS ---");
        console.log(`Extracted pages: ${data.pages.length}`);
        
        // Extract text content from the first 5 pages
        let fullText = "";
        for (const page of data.pages) {
            const pageText = page.content.map(item => item.str).join(' ');
            fullText += pageText + "\n\n";
        }
        
        console.log("--- PREVIEW OF TEXT ---");
        console.log(fullText.substring(0, 1500));
        console.log("------------------------");
    } catch (e) {
        console.error("Failed to parse PDF:", e);
    }
}

testParse();
