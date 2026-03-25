const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  addContent,
  updateContent,
  deleteContent,
  getAllUsers,
  updateUserRole,
} = require('../controllers/adminController');

// جميع مسارات المشرف محمية بالـ middleware protect و admin
router.post('/contents', protect, admin, addContent);
router.put('/contents/:id', protect, admin, updateContent);
router.delete('/contents/:id', protect, admin, deleteContent);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/role', protect, admin, updateUserRole);

module.exports = router;
