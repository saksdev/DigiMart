const express = require('express');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Submit UPI payment reference (user)
router.post('/submit', authMiddleware, async (req, res) => {
  const { amount, referenceId, productIds } = req.body;

  if (!amount || !referenceId || !productIds || !Array.isArray(productIds)) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    const payment = new Payment({
      userId: req.user._id,
      amount,
      referenceId,
      productIds, // Store array of product IDs
      status: 'Pending'
    });

    await payment.save();

    res.json({ success: true, message: 'Payment submitted, awaiting admin approval.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Admin approves payment
router.put('/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.status = 'Approved';
    await payment.save();

    res.json({ message: 'Payment approved. User can now download the product.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all approved downloads for the logged-in user
// Get all approved downloads for the logged-in user
router.get('/my-downloads', authMiddleware, async (req, res) => {
  try {
    const approvedPayments = await Payment.find({
      userId: req.user._id,
      status: 'Approved',
    })
      .populate('productIds') // ✅ Populating actual product data
      .select('productIds referenceId createdAt');

    // Flatten all products into one array with reference/payment info
    const products = approvedPayments.flatMap((payment) =>
      payment.productIds.map((product) => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        scriptUrl: product.scriptUrl,
        referenceId: payment.referenceId,
        createdAt: payment.createdAt,
      }))
    );

    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Admin: get all pending payments
router.get('/pending', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pendingPayments = await Payment.find({ status: 'Pending' })
      .populate('userId', 'email name')
      .sort({ createdAt: -1 });

    res.json(pendingPayments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
