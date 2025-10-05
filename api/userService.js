// user.js
// 12 Services

// User structure:
// firstName
// lastName
// userID
// role
// email
// username
// password
// projects


// Uses User model and other imports
const express = require('express');
const app = express();
const User = require('../models/user.js'); 
app.use(express.json());


// 1. Get a single user by ID (GET)
// /api/user/:id
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).send('User not found.');
    res.json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


// 2. Create user (POST) 
// /api/user/createuser
app.post('/api/user/createuser', async (req, res) => {
  try {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      role: req.body.role || 'student',
      projects: req.body.projects || []
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// 3. Update username (PUT)
// /api/user/:id/updateusername
app.put('/api/user/:id/updateusername', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username: req.body.username },
      { new: true }
    );
    if (!updatedUser) return res.status(404).send('User not found.');
    res.json(updatedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// 4. Update user's name (PUT)
// /api/user/:id/updatename
app.put('/api/user/:id/updatename', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName
      },
      { new: true }
    );
    if (!updatedUser) return res.status(404).send('User not found.');
    res.json(updatedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// 5. Update user's email (PUT)
// /api/user/:id/updateemail
app.put('/api/user/:id/updateemail', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { email: req.body.email },
      { new: true }
    );
    if (!updatedUser) return res.status(404).send('User not found.');
    res.json(updatedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// 6. Delete user's account (DELETE)
// /api/user/:id
app.delete('/api/user/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).send('User not found.');
    res.status(204).send();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// 7. Update profile icon (PUT)
// /api/user/:id/updateicon
app.put('/api/user/:id/updateicon', async (req, res) => {
  try {
    const { icon } = req.body;
    if (!icons.includes(icon)) return res.status(400).send('Invalid icon.');

    const user = await User.findByIdAndUpdate(req.params.id, { icon }, { new: true });
    if (!user) return res.status(404).send('User not found.');
    res.json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// 8. Update profile banner (PUT)
// /api/user/:id/updatebanner
app.put('/api/user/:id/updatebanner', async (req, res) => {
  try {
    const { banner } = req.body;
    if (!banners.includes(banner)) return res.status(400).send('Invalid banner.');

    const user = await User.findByIdAndUpdate(req.params.id, { banner }, { new: true });
    if (!user) return res.status(404).send('User not found.');
    res.json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// 9. Update profile backdrop (PUT)
// /api/user/:id/updatebackdrop
app.put('/api/user/:id/updatebackdrop', async (req, res) => {
  try {
    const { backdrop } = req.body;
    if (!backdrops.includes(backdrop)) return res.status(400).send('Invalid backdrop.');

    const user = await User.findByIdAndUpdate(req.params.id, { backdrop }, { new: true });
    if (!user) return res.status(404).send('User not found.');
    res.json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// 10. Get available icons (GET)
// /api/user/icons
app.get('/api/user/icons', (req, res) => res.json(icons));

// 11. Get available banners (GET)
// /api/user/banners
app.get('/api/user/banners', (req, res) => res.json(banners));

// 12. Get available backdrops (GET)
// /api/user/backdrops
app.get('/api/user/backdrops', (req, res) => res.json(backdrops));

module.exports = app;