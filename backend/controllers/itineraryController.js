const multer = require('multer');
const itineraryService = require('../services/itineraryService');
const { AppError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

const storage = multer.memoryStorage();

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
    try {
      const itinerary = await itineraryService.createItinerary({
        userId: req.user.id,
        file: req.file,
      });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        itinerary,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserItineraries = async (req, res, next) => {
    try {
      const itineraries = await itineraryService.getUserItineraries(req.user.id);
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
      const itinerary = await itineraryService.getItineraryById(req.params.id, req.user.id);
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
      await itineraryService.deleteItinerary(req.params.id, req.user.id);
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
      const itinerary = await itineraryService.getSharedItinerary(req.params.shareToken);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        itinerary,
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
