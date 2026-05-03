const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    res.render('hotels/index', { hotels });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to fetch hotels');
    res.redirect('/');
  }
});

// Create hotel form (admin only)
router.get('/new', ensureAdmin, (req, res) => {
  res.render('hotels/create');
});

// Create hotel (admin only)
router.post('/', ensureAdmin, async (req, res) => {
  try {
    const { name, description, address, city, price, rooms, amenities } = req.body;
    
    // Convert comma-separated amenities to array
    const amenitiesArray = amenities.split(',').map(item => item.trim());
    
    const newHotel = new Hotel({
      name,
      description,
      address,
      city,
      price,
      rooms,
      amenities: amenitiesArray
    });
    
    await newHotel.save();
    
    req.flash('success', 'Hotel added successfully');
    res.redirect('/hotels');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to add hotel');
    res.redirect('/hotels/new');
  }
});

// Show hotel details
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      req.flash('error', 'Hotel not found');
      return res.redirect('/hotels');
    }
    
    res.render('hotels/show', { hotel });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to fetch hotel details');
    res.redirect('/hotels');
  }
});

// Edit hotel form (admin only)
router.get('/:id/edit', ensureAdmin, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      req.flash('error', 'Hotel not found');
      return res.redirect('/hotels');
    }
    
    res.render('hotels/edit', { hotel });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to fetch hotel');
    res.redirect('/hotels');
  }
});

// Update hotel (admin only)
router.put('/:id', ensureAdmin, async (req, res) => {
  try {
    const { name, description, address, city, price, rooms, amenities } = req.body;
    
    // Convert comma-separated amenities to array
    const amenitiesArray = amenities.split(',').map(item => item.trim());
    
    await Hotel.findByIdAndUpdate(req.params.id, {
      name,
      description,
      address,
      city,
      price,
      rooms,
      amenities: amenitiesArray
    });
    
    req.flash('success', 'Hotel updated successfully');
    res.redirect(`/hotels/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update hotel');
    res.redirect(`/hotels/${req.params.id}/edit`);
  }
});

// Delete hotel (admin only)
router.delete('/:id', ensureAdmin, async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    
    req.flash('success', 'Hotel deleted successfully');
    res.redirect('/hotels');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete hotel');
    res.redirect('/hotels');
  }
});

module.exports = router;