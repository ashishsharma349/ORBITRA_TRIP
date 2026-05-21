const express = require('express');
const { itineraryController, upload } = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/upload', protect, upload.single('file'), itineraryController.uploadAndProcess);
router.get('/', protect, itineraryController.getUserItineraries);
router.get('/shared/:shareToken', itineraryController.getSharedItinerary);
router.get('/:id', protect, itineraryController.getItineraryById);
router.delete('/:id', protect, itineraryController.deleteItinerary);

module.exports = router;
