const Itinerary = require('../models/Itinerary');

class ItineraryRepository {
  async create(itineraryData, options = {}) {
    const itinerary = new Itinerary(itineraryData);
    return await itinerary.save(options);
  }

  async findById(id, options = {}) {
    return await Itinerary.findById(id, null, options).populate('document');
  }

  async findByUser(userId, options = {}) {
    return await Itinerary.find({ user: userId }, null, options).sort({ createdAt: -1 });
  }

  async update(id, updateData, options = {}) {
    return await Itinerary.findByIdAndUpdate(id, updateData, { new: true, ...options });
  }

  async delete(id, options = {}) {
    return await Itinerary.findByIdAndDelete(id, options);
  }

  async findByDocumentId(documentId) {
    return await Itinerary.findOne({ document: documentId });
  }

  async findByShareToken(shareToken) {
    return await Itinerary.findOne({ shareToken });
  }
}

module.exports = new ItineraryRepository();
