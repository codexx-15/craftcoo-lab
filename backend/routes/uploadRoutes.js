const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ url: req.file.path });
    } else {
        res.status(400).json({ message: 'Failed to upload image' });
    }
});

// Custom painting upload (Available to all logged-in users)
router.post('/custom', protect, upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ url: req.file.path });
    } else {
        res.status(400).json({ message: 'Failed to upload image' });
    }
});

module.exports = router;
