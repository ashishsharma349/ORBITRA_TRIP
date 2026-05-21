const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegisterInput, validateLoginInput } = require('../middleware/validatorMiddleware');

const router = express.Router();

router.post('/signup', validateRegisterInput, authController.signup);
router.post('/login', validateLoginInput, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
