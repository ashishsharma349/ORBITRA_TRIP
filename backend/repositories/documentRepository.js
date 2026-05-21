const Document = require('../models/Document');

class DocumentRepository {
  async create(documentData) {
    const doc = new Document(documentData);
    return await doc.save();
  }

  async findById(id) {
    return await Document.findById(id);
  }

  async update(id, updateData) {
    return await Document.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findByUser(userId) {
    return await Document.find({ user: userId }).sort({ createdAt: -1 });
  }

  async delete(id) {
    return await Document.findByIdAndDelete(id);
  }
}

module.exports = new DocumentRepository();
