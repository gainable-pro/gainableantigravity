import XLSX from 'xlsx';
import path from 'path';

const excelPath = 'C:\\Users\\ghari\\\.gemini\\antigravity-ide\\scratch\\cvc_data.xlsx';

try {
  console.log('Loading workbook...');
  const workbook = XLSX.readFile(excelPath);
  console.log('Sheet Names:', workbook.SheetNames);
  
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // Get first 5 rows
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0 });
  console.log('First 5 rows:');
  console.log(jsonData.slice(0, 5));
} catch (error) {
  console.error('Error reading Excel file:', error);
}
