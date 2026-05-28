const crypto = require('crypto');
const fs = require('fs');
const mongoose = require('mongoose');
const documentRepository = require('../repositories/documentRepository');
const itineraryRepository = require('../repositories/itineraryRepository');
const documentService = require('../services/documentService');
const cloudinaryService = require('../services/cloudinaryService');
const aiService = require('../services/aiService');
const geminiService = require('../services/geminiService');
const { AppError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

class ItineraryService {
  async createItinerary({ userId, file }) {
    let docRecord;
    try {
      docRecord = await documentRepository.create({
        user: userId,
        originalName: file.originalname,
        filename: file.originalname,
        path: 'pending_cloudinary_upload',
        mimeType: file.mimetype,
        size: file.size,
        status: 'processing',
      });

      const uploadResult = await cloudinaryService.uploadBuffer(file.buffer);

      docRecord.path = uploadResult.secure_url;
      docRecord.filename = uploadResult.public_id;
      await docRecord.save();

      const modelApiKey = process.env.MODEL_API_KEY || '';
      const activeAIService = modelApiKey.startsWith('AIzaSy') ? geminiService : aiService;

      let extractedData;
      if (file.mimetype === 'application/pdf') {
        const text = await documentService.extractTextFromPDF(file.buffer);
        extractedData = await activeAIService.extractItineraryFromText(text);
      } else {
        const base64Image = await documentService.getFileAsBase64(file.buffer);
        extractedData = await activeAIService.extractItineraryFromImage(base64Image, file.mimetype);
      }

      if (extractedData.isValidTravelDocument === false) {
        if (docRecord.filename) {
          try {
            await cloudinaryService.deleteAsset(docRecord.filename);
          } catch (delErr) {
            console.error('Error deleting invalid document from Cloudinary:', delErr);
          }
        }
        const reason = extractedData.garbageReason || 'The uploaded file does not appear to contain valid flight tickets, hotel reservations, or travel itineraries.';
        throw new AppError(
          `Invalid Travel Document: ${reason}`,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      let itinerary;
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          itinerary = await itineraryRepository.create({
            user: userId,
            document: docRecord._id,
            title: extractedData.title || 'Extracted Trip Plan',
            startDate: extractedData.startDate ? new Date(extractedData.startDate) : null,
            endDate: extractedData.endDate ? new Date(extractedData.endDate) : null,
            days: extractedData.days || [],
            shareToken: crypto.randomUUID(),
          }, { session });

          docRecord.status = 'processed';
          await docRecord.save({ session });
        });
      } finally {
        await session.endSession();
      }

      return itinerary;
    } catch (error) {
      if (docRecord) {
        await documentRepository.update(docRecord._id, {
          status: 'failed',
          errorMessage: error.message,
        });
      }
      let clientError = error;
      if (!(error instanceof AppError)) {
        if (error.message.includes('429') || error.message.includes('Too Many Requests') || error.message.includes('quota')) {
          clientError = new AppError(
            'The itinerary generation service is currently experiencing high demand. Please try uploading again in a few moments.',
            429
          );
        } else {
          clientError = new AppError(
            'An error occurred while generating the itinerary. Please try again later.',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
          );
        }
      }
      throw clientError;
    }
  }

  async getUserItineraries(userId) {
    return await itineraryRepository.findByUser(userId);
  }

  async getItineraryById(id, userId) {
    const itinerary = await itineraryRepository.findById(id);
    if (!itinerary) {
      throw new AppError('Itinerary not found', HTTP_STATUS.NOT_FOUND);
    }
    
    if (itinerary.user.toString() !== userId) {
      throw new AppError('Access Denied. You do not own this itinerary.', HTTP_STATUS.FORBIDDEN);
    }
    return itinerary;
  }

  async deleteItinerary(id, userId) {
    const itinerary = await itineraryRepository.findById(id);
    if (!itinerary) {
      throw new AppError('Itinerary not found', HTTP_STATUS.NOT_FOUND);
    }

    if (itinerary.user.toString() !== userId) {
      throw new AppError('Access Denied. You do not own this itinerary.', HTTP_STATUS.FORBIDDEN);
    }

    // 1. Delete associated files first (Cloudinary or local file system)
    if (itinerary.document) {
      const doc = await documentRepository.findById(itinerary.document._id);
      if (doc) {
        if (doc.path && (doc.path.startsWith('http://') || doc.path.startsWith('https://'))) {
          try {
            if (doc.filename) {
              await cloudinaryService.deleteAsset(doc.filename);
            }
          } catch (err) {
            console.error('Error deleting document from Cloudinary:', err);
          }
        } else if (doc.path && fs.existsSync(doc.path)) {
          try {
            fs.unlinkSync(doc.path);
          } catch (err) {
            console.error('Error deleting local document file:', err);
          }
        }
      }
    }

    // 2. Perform database deletions atomically in a transaction session
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await itineraryRepository.delete(id, { session });
        if (itinerary.document) {
          await documentRepository.delete(itinerary.document._id, { session });
        }
      });
    } finally {
      await session.endSession();
    }
  }

  async getSharedItinerary(shareToken) {
    const itinerary = await itineraryRepository.findByShareToken(shareToken);
    if (!itinerary) {
      throw new AppError('Itinerary not found', HTTP_STATUS.NOT_FOUND);
    }

    return {
      title: itinerary.title,
      startDate: itinerary.startDate,
      endDate: itinerary.endDate,
      days: itinerary.days.map((d) => ({
        dayNumber: d.dayNumber,
        date: d.date,
        activities: d.activities.map((a) => ({
          time: a.time,
          type: a.type,
          title: a.title,
          description: a.description,
          location: a.location,
        })),
      })),
      shareToken: itinerary.shareToken,
    };
  }
}

module.exports = new ItineraryService();
