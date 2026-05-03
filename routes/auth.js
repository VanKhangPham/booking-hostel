const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const { ensureAuthenticated } = require('../middleware/auth');

// Register page
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, password2 } = req.body;
    
    // Validation
    const errors = [];
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please fill in all fields' });
    }
    if (password !== password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
    if (password.length < 6) {
      errors.push({ msg: 'Password should be at least 6 characters' });
    }
    
    if (errors.length > 0) {
      return res.render('auth/register', { errors, name, email });
    }
    
    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.push({ msg: 'Email is already registered' });
      return res.render('auth/register', { errors, name, email });
    }
    
    // Create new user
    const newUser = new User({ name, email, password });
    await newUser.save();
    
    req.flash('success', 'You are now registered. Please log in.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/auth/register');
  }
});

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Login user
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
});

// Logout user
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'You are logged out');
    res.redirect('/');
  });
});

// Profile page
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('auth/profile');
});

module.exports = router;