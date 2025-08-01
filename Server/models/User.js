const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // for admin access

  // List of approved downloads (linked product IDs)
  downloads: [{ type: String }], 

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
