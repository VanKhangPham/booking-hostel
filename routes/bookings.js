const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// Get user bookings
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('hotel')
      .sort({ createdAt: -1 });
    
    res.render('bookings/index', { bookings });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to fetch bookings');
    res.redirect('/');
  }
});

// Get all bookings (admin only)
router.get('/admin', ensureAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user')
      .populate('hotel')
      .sort({ createdAt: -1 });
    
    res.render('bookings/admin', { bookings });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to fetch bookings');
    res.redirect('/');
  }
});

// Create booking form
router.get('/new/:hotelId', ensureAuthenticated, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);
    
    if (!hotel) {
      req.flash('error', 'Hotel not found');
      return res.redirect('/hotels');
    }
    
    res.render('bookings/create', { hotel });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to fetch hotel');
    res.redirect('/hotels');
  }
});

// Create booking
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut, guests, rooms } = req.body;
    
    const hotel = await Hotel.findById(hotelId);
    
    if (!hotel) {
      req.flash('error', 'Hotel not found');
      return res.redirect('/hotels');
    }
    
    // Calculate number of days
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate total price
    const totalPrice = hotel.price * rooms * diffDays;
    
    const newBooking = new Booking({
      user: req.user._id,
      hotel: hotelId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      rooms,
      totalPrice,
      status: 'pending'
    });
    
    await newBooking.save();
    
    req.flash('success', 'Booking created successfully');
    res.redirect('/bookings');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to create booking');
    res.redirect('/hotels');
  }
});

// View booking details
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel');
    
    if (!booking) {
      req.flash('error', 'Booking not found');
      return res.redirect('/bookings');
    }
    
    // Check if the booking belongs to the current user or if user is admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      req.flash('error', 'Not authorized');
      return res.redirect('/bookings');
    }
    
    res.render('bookings/show', { booking });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to fetch booking');
    res.redirect('/bookings');
  }
});

// Cancel booking
router.put('/:id/cancel', ensureAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      req.flash('error', 'Booking not found');
      return res.redirect('/bookings');
    }
    
    // Check if the booking belongs to the current user or if user is admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      req.flash('error', 'Not authorized');
      return res.redirect('/bookings');
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    req.flash('success', 'Booking cancelled successfully');
    res.redirect('/bookings');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to cancel booking');
    res.redirect('/bookings');
  }
});

// Change booking status (admin only)
router.put('/:id/status', ensureAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    await Booking.findByIdAndUpdate(req.params.id, { status });
    
    req.flash('success', 'Booking status updated successfully');
    res.redirect('/bookings/admin');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update booking status');
    res.redirect('/bookings/admin');
  }
});

module.exports = router;