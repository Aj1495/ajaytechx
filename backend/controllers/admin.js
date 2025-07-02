console.log('Loading Content model...');

const Content = require('../models/Content');
const Product = require('../models/Product');
const Contact = require('../models/Contact');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// ===== CONTENT MANAGEMENT =====

// @desc    Get all content for admin
// @route   GET /api/admin/content
// @access  Private/Admin
exports.getAllContent = async (req, res) => {
  try {
    const { section, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (section) query.section = section;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { key: { $regex: search, $options: 'i' } },
      ];
    }

    const content = await Content.find(query)
      .populate('lastModifiedBy', 'firstName lastName')
      .sort({ section: 1, order: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Content.countDocuments(query);

    res.status(200).json({
      success: true,
      content,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error('Get all content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching content',
    });
  }
};

// @desc    Create content
// @route   POST /api/admin/content
// @access  Private/Admin
exports.createContent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { section, key, type, title, value, description, order = 0 } = req.body;

    const content = await Content.create({
      section,
      key,
      type,
      title,
      value,
      description,
      order,
      lastModifiedBy: req.user.id,
    });

    await content.populate('lastModifiedBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      content,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Content with this section and key already exists',
      });
    }
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating content',
    });
  }
};

// @desc    Update content
// @route   PUT /api/admin/content/:id
// @access  Private/Admin
exports.updateContent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModifiedBy: req.user.id },
      { new: true, runValidators: true }
    ).populate('lastModifiedBy', 'firstName lastName');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      content,
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating content',
    });
  }
};

// @desc    Delete content
// @route   DELETE /api/admin/content/:id
// @access  Private/Admin
exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    await content.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting content',
    });
  }
};

// ===== PRODUCT MANAGEMENT =====

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query)
      .populate('createdBy', 'firstName lastName')
      .populate('lastModifiedBy', 'firstName lastName')
      .sort({ order: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
    });
  }
};

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const productData = {
      ...req.body,
      createdBy: req.user.id,
      lastModifiedBy: req.user.id,
    };

    // Handle file upload
    if (req.file) {
      productData.image = {
        url: `/uploads/${req.file.filename}`,
        alt: req.body.imageAlt || req.body.name,
      };
    }

    // Parse arrays if they come as strings
    if (typeof req.body.features === 'string') {
      productData.features = JSON.parse(req.body.features);
    }
    if (typeof req.body.benefits === 'string') {
      productData.benefits = JSON.parse(req.body.benefits);
    }
    if (typeof req.body.tags === 'string') {
      productData.tags = JSON.parse(req.body.tags);
    }

    const product = await Product.create(productData);
    await product.populate('createdBy lastModifiedBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product',
    });
  }
};

// Simplified versions of other functions due to space constraints
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModifiedBy: req.user.id },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== CONTACT MANAGEMENT =====

exports.getContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('notes.addedBy', 'firstName lastName');
    
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addContactNote = async (req, res) => {
  try {
    const { note } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $push: { notes: { note, addedBy: req.user.id } } },
      { new: true }
    );
    
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===== USER MANAGEMENT =====

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}; 
