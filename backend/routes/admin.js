console.log('Loading admin routes...');

const express = require('express');
const { body } = require('express-validator');
const {
  // Content management
  createContent,
  updateContent,
  deleteContent,
  getAllContent,
  
  // Product management
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  
  // Contact management
  getContacts,
  getContact,
  updateContactStatus,
  addContactNote,
  
  // User management
  getUsers,
  updateUserRole,
} = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

// Content management validation
const contentValidation = [
  body('section')
    .isIn(['home', 'about', 'contact', 'general'])
    .withMessage('Invalid section'),
  body('key')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Key must be between 1 and 100 characters'),
  body('type')
    .isIn(['text', 'html', 'image', 'json', 'array'])
    .withMessage('Invalid content type'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('value')
    .notEmpty()
    .withMessage('Value is required'),
];

// Product validation
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('subtitle')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subtitle must be between 1 and 200 characters'),
  body('briefIntro')
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Brief intro must be between 1 and 300 characters'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Description is required'),
  body('detailedInfo')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Detailed info is required'),
  body('category')
    .isIn(['AI Solutions', 'Machine Learning', 'Data Analytics', 'Automation', 'Consulting'])
    .withMessage('Invalid category'),
];

// Contact note validation
const contactNoteValidation = [
  body('note')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Note must be between 1 and 1000 characters'),
];

// Content Management Routes
router.get('/content', getAllContent);
router.post('/content', contentValidation, createContent);
router.put('/content/:id', contentValidation, updateContent);
router.delete('/content/:id', deleteContent);

// Product Management Routes
router.get('/products', getAllProducts);
router.post('/products', upload.single('productImage'), handleMulterError, productValidation, createProduct);
router.put('/products/:id', upload.single('productImage'), handleMulterError, productValidation, updateProduct);
router.delete('/products/:id', deleteProduct);

// Contact Management Routes
router.get('/contacts', getContacts);
router.get('/contacts/:id', getContact);
router.put('/contacts/:id/status', updateContactStatus);
router.post('/contacts/:id/notes', contactNoteValidation, addContactNote);

// User Management Routes
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router; 
