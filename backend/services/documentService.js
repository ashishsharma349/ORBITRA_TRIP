const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const { AppError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

class DocumentService {
  async extractTextFromPDF(source) {
    try {
      const dataBuffer = Buffer.isBuffer(source) ? source : fs.readFileSync(source);
      const parser = new PDFParse({ data: dataBuffer });
      const result = await parser.getText();
      await parser.destroy();
      return result.text;
    } catch (error) {
      throw new AppError('Invalid or corrupted PDF document structure.', HTTP_STATUS.BAD_REQUEST);
    }
  }

  async getFileAsBase64(source) {
    const dataBuffer = Buffer.isBuffer(source) ? source : fs.readFileSync(source);
    return dataBuffer.toString('base64');
  }
}

module.exports = new DocumentService();
