console.log('Loading Content model...');

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot be more than 20 characters'],
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters'],
  },
  subject: {
    type: String,
    required: [true, 'Please provide subject'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters'],
  },
  message: {
    type: String,
    required: [true, 'Please provide message'],
    maxlength: [2000, 'Message cannot be more than 2000 characters'],
  },
  inquiryType: {
    type: String,
    enum: ['general', 'product', 'support', 'partnership', 'career'],
    default: 'general',
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'responded', 'closed'],
    default: 'new',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  notes: [{
    note: {
      type: String,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  responseDate: Date,
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: true,
});

// Indexes
contactSchema.index({ status: 1 });
contactSchema.index({ inquiryType: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1 });

module.exports = mongoose.model('Contact', contactSchema); 
