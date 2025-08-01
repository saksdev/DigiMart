require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);


app.get("/", (req, res) => {
  res.send("DigiMart API is Live");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Add CROS For Work in Render
const path = require('path');

app.use(cors({
  origin: ['https://your-frontend.netlify.app'],
  credentials: true,
}));

// Serve static files from React frontend
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// This will handle all unknown routes (like /shop, /cart, etc.)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});
