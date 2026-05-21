const fs = require('fs');
const pdfParse = require('pdf-parse');

class DocumentService {
  async extractTextFromPDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(dataBuffer);
    return parsed.text;
  }

  async getFileAsBase64(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    return dataBuffer.toString('base64');
  }
}

module.exports = new DocumentService();
