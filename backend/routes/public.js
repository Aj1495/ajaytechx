console.log('Loading admin routes...');

const express = require('express');
const { body } = require('express-validator');
const {
  getContent,
  getProducts,
  getProduct,
  submitContact,
} = require('../controllers/public');

const router = express.Router();

// Contact form validation rules
const contactValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('subject')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject must be between 1 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
];

// Public routes
router.get('/content/:section', getContent);
router.get('/products', getProducts);
router.get('/products/:slug', getProduct);
router.post('/contact', contactValidation, submitContact);

module.exports = router; 
