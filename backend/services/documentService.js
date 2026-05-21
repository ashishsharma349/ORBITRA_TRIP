const fs = require('fs');
const { PDFParse } = require('pdf-parse');

class DocumentService {
  async extractTextFromPDF(source) {
    const dataBuffer = Buffer.isBuffer(source) ? source : fs.readFileSync(source);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }

  async getFileAsBase64(source) {
    const dataBuffer = Buffer.isBuffer(source) ? source : fs.readFileSync(source);
    return dataBuffer.toString('base64');
  }
}

module.exports = new DocumentService();
