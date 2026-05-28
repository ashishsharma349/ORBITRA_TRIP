const Document = require('../models/Document');

class DocumentRepository {
  async create(documentData, options = {}) {
    const doc = new Document(documentData);
    return await doc.save(options);
  }

  async findById(id, options = {}) {
    return await Document.findById(id, null, options);
  }

  async update(id, updateData, options = {}) {
    return await Document.findByIdAndUpdate(id, updateData, { new: true, ...options });
  }

  async findByUser(userId, options = {}) {
    return await Document.find({ user: userId }, null, options).sort({ createdAt: -1 });
  }

  async delete(id, options = {}) {
    return await Document.findByIdAndDelete(id, options);
  }
}

module.exports = new DocumentRepository();
