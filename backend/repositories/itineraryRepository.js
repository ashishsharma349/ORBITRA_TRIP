const Itinerary = require('../models/Itinerary');

class ItineraryRepository {
  async create(itineraryData) {
    const itinerary = new Itinerary(itineraryData);
    return await itinerary.save();
  }

  async findById(id) {
    return await Itinerary.findById(id).populate('document');
  }

  async findByUser(userId) {
    return await Itinerary.find({ user: userId }).sort({ createdAt: -1 });
  }

  async update(id, updateData) {
    return await Itinerary.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Itinerary.findByIdAndDelete(id);
  }

  async findByDocumentId(documentId) {
    return await Itinerary.findOne({ document: documentId });
  }

  async findByShareToken(shareToken) {
    return await Itinerary.findOne({ shareToken });
  }
}

module.exports = new ItineraryRepository();
