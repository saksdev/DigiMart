const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Payment = require('../models/Payment');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

// Unified Dashboard Route
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      // Admin: return all users and products
      const users = await User.find({}, 'name email isAdmin createdAt');
      const products = await Product.find({}, 'name price image downloadLink');

      return res.json({
        isAdmin: true,
        users,
        products,
      });
    } else {
      // Regular User: return all their payments (Approved + Pending)
      const payments = await Payment.find({ userId: req.user._id })
        .populate('productIds', 'name price downloadLink');

      const purchases = [];

      for (const payment of payments) {
        if (payment.productIds && payment.productIds.length > 0) {
          for (const product of payment.productIds) {
            purchases.push({
              productId: product._id,
              name: product.name,
              price: product.price,
              status: payment.status,
              referenceId: payment.referenceId,
              amount: payment.amount,
              downloadLink: product.downloadLink,
              createdAt: payment.createdAt,
            });
          }
        }
      }

      return res.json({
        isAdmin: false,
        purchases,
      });
    }
  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
});


// Admin – fetch all pending payments
router.get('/admin/payments/pending', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const pendingPayments = await Payment.find({ status: 'Pending' })
      .populate('userId', 'email')
      .populate('productIds', 'name price');

    const formatted = pendingPayments.map(p => ({
      _id: p._id,
      userId: { email: p.userId.email },
      amount: p.amount,
      referenceId: p.referenceId,
      products: p.productIds.map(prod => ({
        name: prod.name,
        price: prod.price
      }))
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Pending payments fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch pending payments', error: err.message });
  }
});

// Admin – fetch all approved payments
router.get('/admin/payments', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const approvedPayments = await Payment.find({ status: 'Approved' })
      .populate('userId', 'email')
      .populate('productIds', 'name price');

    const formatted = approvedPayments.map(p => ({
      _id: p._id,
      userId: { email: p.userId.email },
      amount: p.amount,
      referenceId: p.referenceId,
      products: p.productIds.map(prod => ({
        name: prod.name,
        price: prod.price
      }))
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Approved payments fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch approved payments', error: err.message });
  }
});

// Reject a payment (also deletes it)
router.put('/payments/:id/reject', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const paymentId = req.params.id;

    // 🗑️ Delete the payment
    const result = await Payment.findByIdAndDelete(paymentId);

    if (!result) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Payment rejected and removed successfully.' });
  } catch (err) {
    console.error('Error rejecting payment:', err);
    res.status(500).json({ message: 'Failed to reject payment', error: err.message });
  }
});


module.exports = router;
