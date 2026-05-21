const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const documentRepository = require('../repositories/documentRepository');
const itineraryRepository = require('../repositories/itineraryRepository');
const documentService = require('../services/documentService');
const aiService = require('../services/aiService');
const { AppError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only PDF and image files are allowed', HTTP_STATUS.BAD_REQUEST), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

class ItineraryController {
  uploadAndProcess = async (req, res, next) => {
    let docRecord;
    try {
      if (!req.file) {
        return next(new AppError('No file uploaded', HTTP_STATUS.BAD_REQUEST));
      }

      docRecord = await documentRepository.create({
        user: req.user.id,
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size,
        status: 'processing',
      });

      let extractedData;
      if (req.file.mimetype === 'application/pdf') {
        const text = await documentService.extractTextFromPDF(req.file.path);
        extractedData = await aiService.extractItineraryFromText(text);
      } else {
        const base64Image = await documentService.getFileAsBase64(req.file.path);
        extractedData = await aiService.extractItineraryFromImage(base64Image, req.file.mimetype);
      }

      const itinerary = await itineraryRepository.create({
        user: req.user.id,
        document: docRecord._id,
        title: extractedData.title || 'Extracted Trip Plan',
        startDate: extractedData.startDate ? new Date(extractedData.startDate) : null,
        endDate: extractedData.endDate ? new Date(extractedData.endDate) : null,
        days: extractedData.days || [],
        shareToken: crypto.randomUUID(),
      });

      await documentRepository.update(docRecord._id, { status: 'processed' });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        itinerary,
      });
    } catch (error) {
      if (docRecord) {
        await documentRepository.update(docRecord._id, {
          status: 'failed',
          errorMessage: error.message,
        });
      }
      next(error);
    }
  };

  getUserItineraries = async (req, res, next) => {
    try {
      const itineraries = await itineraryRepository.findByUser(req.user.id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        itineraries,
      });
    } catch (error) {
      next(error);
    }
  };

  getItineraryById = async (req, res, next) => {
    try {
      const itinerary = await itineraryRepository.findById(req.params.id);
      if (!itinerary) {
        return next(new AppError('Itinerary not found', HTTP_STATUS.NOT_FOUND));
      }
      if (itinerary.user.toString() !== req.user.id) {
        return next(new AppError('Access Denied. You do not own this itinerary.', HTTP_STATUS.FORBIDDEN));
      }
      res.status(HTTP_STATUS.OK).json({
        success: true,
        itinerary,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteItinerary = async (req, res, next) => {
    try {
      const itinerary = await itineraryRepository.findById(req.params.id);
      if (!itinerary) {
        return next(new AppError('Itinerary not found', HTTP_STATUS.NOT_FOUND));
      }
      if (itinerary.user.toString() !== req.user.id) {
        return next(new AppError('Access Denied. You do not own this itinerary.', HTTP_STATUS.FORBIDDEN));
      }

      await itineraryRepository.delete(req.params.id);

      if (itinerary.document) {
        const doc = await documentRepository.findById(itinerary.document._id);
        if (doc) {
          if (fs.existsSync(doc.path)) {
            fs.unlinkSync(doc.path);
          }
          await documentRepository.delete(doc._id);
        }
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Itinerary deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getSharedItinerary = async (req, res, next) => {
    try {
      const itinerary = await itineraryRepository.findByShareToken(req.params.shareToken);
      if (!itinerary) {
        return next(new AppError('Itinerary not found', HTTP_STATUS.NOT_FOUND));
      }
      res.status(HTTP_STATUS.OK).json({
        success: true,
        itinerary: {
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
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  itineraryController: new ItineraryController(),
  upload,
};
