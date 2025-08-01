const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// 🔹 Get all pending payments (recommended route)
router.get('/payments/pending', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'Pending' })
      .populate('userId', 'name email')
      .populate('productIds', 'name price');
    res.json(payments);
  } catch (err) {
    console.error('Error fetching pending payments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔹 Get all approved payments (recommended route)
router.get('/payments/approved', authMiddleware, adminMiddleware, async (req, res) => {
  const payments = await Payment.find({ status: 'Approved' }) // ✅ correct
    .populate('userId', 'name email')
    .populate('productIds', 'name price');
  res.json(payments);
});


// 🔹 Legacy: Get only pending payments (still kept)
router.get('/payments', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'Pending' })
      .populate('userId', 'name email');
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔹 Approve a payment
router.put('/payments/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.status = 'Approved'; // 🔥 Critical
    await payment.save();

    res.json({ success: true, message: 'Payment approved.' });
  } catch (err) {
    console.error('Approval error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// 🔹 Reject a payment (delete from DB)
router.put('/payments/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Payment not found' });

    res.json({ success: true, message: 'Payment rejected and deleted.' });
  } catch (err) {
    console.error('Reject error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// 🔹 Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, 'name email isAdmin');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔹 Get all products
router.get('/products', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔹 Add a new product
router.post('/products', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, price, image, scriptUrl } = req.body;
    const product = new Product({ name, price, image, scriptUrl });
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔹 Update a product
router.put('/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, price, image, scriptUrl } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, image, scriptUrl },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔹 Delete a product
router.delete('/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
