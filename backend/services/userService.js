const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

const icons = ['default_icon', 'avatar1', 'avatar2'];
const banners = ['default_banner', 'banner1', 'banner2'];
const backdrops = ['default_backdrop', 'backdrop1', 'backdrop2'];

router.use(express.json());

router.get('/icons', (req, res) => res.json(icons));
router.get('/banners', (req, res) => res.json(banners));
router.get('/backdrops', (req, res) => res.json(backdrops));

router.post('/createuser', async (req, res) => {
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

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).send('User not found.');
    res.json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.put('/:id/updateusername', async (req, res) => {
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

router.put('/:id/updatename', async (req, res) => {
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

router.put('/:id/updateemail', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).send('User not found.');
    res.status(204).send();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.put('/:id/updateicon', async (req, res) => {
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

router.put('/:id/updatebanner', async (req, res) => {
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

router.put('/:id/updatebackdrop', async (req, res) => {
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

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const userData = user.toObject();
    delete userData.password;

    res.json({ message: 'Login successful', user: userData });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Purchase an item (icon, banner, or backdrop)
router.post('/:id/purchase', async (req, res) => {
  try {
    const { itemType, itemId } = req.body; // itemType: 'icon' | 'banner' | 'backdrop'
    
    if (!['icon', 'banner', 'backdrop'].includes(itemType)) {
      return res.status(400).json({ error: 'Invalid item type' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Determine which array to update
    let arrayField;
    if (itemType === 'icon') arrayField = 'ownedIcons';
    else if (itemType === 'banner') arrayField = 'ownedBanners';
    else if (itemType === 'backdrop') arrayField = 'ownedBackdrops';

    // Check if already owned
    if (user[arrayField].includes(itemId)) {
      return res.status(400).json({ error: 'Item already owned' });
    }

    // Add item to owned array
    user[arrayField].push(itemId);
    await user.save();

    res.json({ 
      message: 'Purchase successful', 
      user: user.toObject() 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;