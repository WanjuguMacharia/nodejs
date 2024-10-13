const express = require('express');
const { signUp, signIn, logout, addDoctor, getDoctors, bookAppointment, getAppointments } = require('../controllers/authController');
const router = express.Router();

// Middleware to check if the user is already logged in
function checkAuthenticated(req, res, next) {
  if (req.session.user) {
    return res.status(400).json({ message: 'You are already logged in.' });
  }
  next();
}

router.post('/signUp', checkAuthenticated, signUp);
router.post('/signIn', checkAuthenticated, signIn);
router.get('/logout', logout);
router.post('/add', addDoctor);
router.get('/list', getDoctors);
router.post('/book', bookAppointment);
router.get('/list', getAppointments);

module.exports = router;
