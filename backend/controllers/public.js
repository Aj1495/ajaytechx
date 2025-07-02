console.log('Loading Content model...');

const Content = require('../models/Content');
const Product = require('../models/Product');
const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');

// @desc    Get content by section
// @route   GET /api/public/content/:section
// @access  Public
exports.getContent = async (req, res) => {
  try {
    const { section } = req.params;
    
    const content = await Content.find({ 
      section, 
      isActive: true 
    }).sort({ order: 1 });

    if (!content || content.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No content found for this section',
      });
    }

    // Transform content to a more usable format
    const transformedContent = {};
    content.forEach(item => {
      transformedContent[item.key] = {
        title: item.title,
        value: item.value,
        type: item.type,
        description: item.description,
        updatedAt: item.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      section,
      content: transformedContent,
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching content',
    });
  }
};

// @desc    Get all active products
// @route   GET /api/public/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, featured, limit } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }

    let productsQuery = Product.find(query)
      .select('name slug subtitle briefIntro image category tags isFeatured order createdAt')
      .sort({ order: 1, createdAt: -1 });

    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }

    const products = await productsQuery;

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
    });
  }
};

// @desc    Get single product by slug
// @route   GET /api/public/products/:slug
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const product = await Product.findOne({ slug, isActive: true })
      .populate('createdBy', 'firstName lastName')
      .populate('lastModifiedBy', 'firstName lastName');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
    });
  }
};

// @desc    Submit contact form
// @route   POST /api/public/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      subject,
      message,
      inquiryType = 'general',
    } = req.body;

    // Get client IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Create contact submission
    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      phone,
      company,
      subject,
      message,
      inquiryType,
      ipAddress,
      userAgent,
    });

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to user

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      contact: {
        id: contact._id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        subject: contact.subject,
        inquiryType: contact.inquiryType,
        status: contact.status,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting contact form',
    });
  }
}; 
