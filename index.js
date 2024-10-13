const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const db = require('./config/db'); // Use the database connection from db.js
const authRoutes = require('./routes/auth');
const port = process.env.PORT || 3301;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Session configuration
app.use(
  session({
    key: 'user_sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2, // Session expires after 2 hours
    },
  })
);

// Middleware to check if the user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    res.status(401).send('Unauthorized: Please log in to access this page.');
  }
};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes for serving HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signUp', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signUp.html'));
});

app.get('/signIn', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signIn.html'));
});

app.get('/appointments', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'appointments.html'));
});

app.get('/doctors', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'doctors.html'));
});

app.get('/admin', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Authentication routes
app.use('/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong! Please try again later.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
