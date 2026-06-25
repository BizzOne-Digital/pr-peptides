const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:            { type: String, required: true, trim: true },
  slug:            { type: String },
  description:     { type: String, required: true },
  shortDescription:{ type: String },
  price:           { type: Number, required: true },
  comparePrice:    { type: Number },
  dosage:          { type: String },
  category:        { type: String, enum: ['peptide', 'research-compound', 'accessory'], default: 'peptide' },
  images:          [{ type: String }],
  inStock:         { type: Boolean, default: true },
  stockQuantity:   { type: Number, default: 0 },
  purity:          { type: String, default: '99%+' },
  labTested:       { type: Boolean, default: true },
  coaAvailable:    { type: Boolean, default: true },
  researchUseOnly: { type: Boolean, default: true },
  featured:        { type: Boolean, default: false },
  tags:            [{ type: String }],
  isActive:        { type: Boolean, default: true }
}, { timestamps: true });

// Generate slug only on create
productSchema.pre('save', function(next) {
  if (this.isNew) {
    this.slug = this.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);