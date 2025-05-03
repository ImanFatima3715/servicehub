const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const fs = require('fs');
require('dotenv').config();
require('./config/passport');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Express session
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: false,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Ensure uploads folder exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// API Routes
app.use('/api/auth', require('./routes/auth'));           // Your local auth (email/password)
app.use('/api/users', require('./routes/users'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/uploads', require('./routes/uploads'));

// Google OAuth Routes
app.use('/auth', require('./routes/authRoutes'));         // Google OAuth (passport)

// Default Route
app.get('/', (req, res) => {
  res.send('🌐 API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
