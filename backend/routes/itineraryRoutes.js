const express = require('express');
const { itineraryController, upload } = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');
const rateLimiter = require('../middleware/rateLimiterMiddleware');
const { validateUploadInput, validateObjectIdParam } = require('../middleware/validatorMiddleware');
const { idempotency } = require('../middleware/idempotencyMiddleware');

const router = express.Router();

router.post('/upload', protect, rateLimiter, idempotency, upload.single('file'), validateUploadInput, itineraryController.uploadAndProcess);
router.get('/', protect, itineraryController.getUserItineraries);
router.get('/shared/:shareToken', itineraryController.getSharedItinerary);
router.get('/:id', protect, validateObjectIdParam, itineraryController.getItineraryById);
router.delete('/:id', protect, validateObjectIdParam, itineraryController.deleteItinerary);

module.exports = router;
