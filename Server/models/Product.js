const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
  downloadLink: { type: String, required: true },
  discount: { type: Number, default: 0 }, // Discount percentage (0-100)
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);