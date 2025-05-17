const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const verify = require('../middlewares/authMiddleware');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/me', verify, auth.getProfile);

module.exports = router;
