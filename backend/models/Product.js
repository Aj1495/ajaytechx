console.log('Loading Product model...');

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  subtitle: {
    type: String,
    required: [true, 'Please provide product subtitle'],
    trim: true,
    maxlength: [200, 'Product subtitle cannot be more than 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
  },
  briefIntro: {
    type: String,
    required: [true, 'Please provide brief introduction'],
    maxlength: [300, 'Brief intro cannot be more than 300 characters'],
  },
  detailedInfo: {
    type: String,
    required: [true, 'Please provide detailed information'],
  },
  features: [{
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: String,
  }],
  benefits: [{
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  }],
  image: {
    url: {
      type: String,
      required: [true, 'Please provide product image'],
    },
    alt: {
      type: String,
      default: '',
    },
    publicId: String,
  },
  gallery: [{
    url: String,
    alt: String,
    publicId: String,
  }],
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['AI Solutions', 'Machine Learning', 'Data Analytics', 'Automation', 'Consulting'],
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  metadata: {
    title: String,
    description: String,
    keywords: [String],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Product', productSchema); 
