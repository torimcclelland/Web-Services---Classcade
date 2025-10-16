const express = require('express');
const router = express.Router();
const {StoreIcon, StoreBanner, StoreBackdrop } = require('../models/store');

router.use(express.json());


//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// Profile Icons ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

// GET all profile icons
router.get('/store_icon', async (req, res) => {
    try {
        const items = await StoreIcon.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching items' });
    }
});

// GET profile icon by id
router.get('/store_icon/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const item = await StoreIcon.findById(id);
        if (!item) {
            return res.status(404).json({message: 'Item not found'});
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Server error finding item' });
    }
})


// CREATE profile icon
router.post('/store_icon', async (req, res) => {
    const { name, price } = req.body;

    // validation for user data
    if (!name || typeof name !== 'string' || price == null || typeof price !== 'number') {
        return res.status(400).json({ error: 'Invalid item: "name" (string) and "price" (number) are required fields.' });
    }

    try {
        // case-insensitive check to prevent duplicate names
        const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const existing = await StoreIcon.findOne({ name: { $regex: `^${escaped}$`, $options: 'i' } });
        if (existing) {
            return res.status(409).json({ error: 'An icon with that name already exists.' });
        }

        // create new item in database
        const newItem = await StoreIcon.create({ name, price });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Server error creating item' });
    }
});


// UPDATE profile icon
router.put('/store_icon/:id', async (req, res) => {
    const id = req.params.id;
    const { name, price } = req.body;

    // validation for user data
    if ((name && typeof name !== 'string') || (price != null && typeof price !== 'number')) {
        return res.status(400).json({ error: 'Invalid item: "name" (string) and "price" (number) are required fields.' });
    }

    try {
        // if a new name was provided, ensure it's not used by another item (case-insensitive)
        if (name) {
            const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const existing = await StoreIcon.findOne({ name: { $regex: `^${escaped}$`, $options: 'i' } });
            if (existing && existing._id.toString() !== id) {
                return res.status(409).json({ error: 'An item with that name already exists.' });
            }
        }

        const update = {};
        if (name !== undefined) update.name = name;
        if (price !== undefined) update.price = price;

        const updatedItem = await StoreIcon.findByIdAndUpdate(id, update, { new: true, runValidators: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Item updated successfully', item: updatedItem });
    } catch (error) {
        res.status(500).json({ error: 'Server error updating item' });
    }
});


// DELETE a profile icon
router.delete('/store_icon/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedItem = await StoreIcon.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({message: 'Item not found'});
        }
        res.json({message: 'Item deleted successfully', item: deletedItem});
    } catch (error) {
        res.status(500).json({ error: 'Server error deleting item' });
    }
})


//////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Banners ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

// GET all banners
router.get('/store_banner', async (req, res) => {
    try {
        const items = await StoreBanner.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching items' });
    }
});

// GET banner by id
router.get('/store_banner/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const item = await StoreBanner.findById(id);
        if (!item) {
            return res.status(404).json({message: 'Item not found'});
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Server error finding item' });
    }
})


// CREATE a banner
// CREATE banner in the store
router.post('/store_banner', async (req, res) => {
    const {name, price} = req.body; 

    // validation for user data
    if (!name || typeof name !== 'string' || price == null || typeof price !== 'number'){
        return res.status(400).json({error: 'Invalid item: "name" (string) and "price" (number) are required fields.'})
    }

    try {
        // case-insensitive check to prevent duplicate names
        const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const existing = await StoreBanner.findOne({ name: { $regex: `^${escaped}$`, $options: 'i' } });
        if (existing) {
            return res.status(409).json({ error: 'A banner with that name already exists.' });
        }

        // create new item in database
        const newItem = await StoreBanner.create({ name, price });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Server error creating item' });
    }
});


// UPDATE a banner
// UPDATE banner in the store
router.put('/store_banner/:id', async (req, res) => {
    const id = req.params.id;
    const {name, price} = req.body;

    // validation for user data
    if ((name && typeof name !== 'string') || (price != null && typeof price !== 'number')) {
        return res.status(400).json({error: 'Invalid item: "name" (string) and "price" (number) are required fields.'});
    }

    try {
        // if a new name was provided, ensure it's not used by another item (case-insensitive)
        if (name) {
            const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const existing = await StoreBanner.findOne({ name: { $regex: `^${escaped}$`, $options: 'i' } });
            if (existing && existing._id.toString() !== id) {
                return res.status(409).json({ error: 'An item with that name already exists.' });
            }
        }

        const update = {};
        if (name !== undefined) update.name = name;
        if (price !== undefined) update.price = price;

        const updatedItem = await StoreBanner.findByIdAndUpdate(id, update, { new: true, runValidators: true });
        if (!updatedItem) {
            return res.status(404).json({message: 'Item not found'});
        }

        res.json({message: 'Item updated successfully', item: updatedItem});
    } catch (error) {
        res.status(500).json({ error: 'Server error updating item' });
    }
});


// DELETE a banner
router.delete('/store_banner/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedItem = await StoreBanner.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({message: 'Item not found'});
        }
        res.json({message: 'Item deleted successfully', item: deletedItem});
    } catch (error) {
        res.status(500).json({ error: 'Server error deleting item' });
    }
})


//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// Backdrops ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

// GET backdrops
router.get('/store_backdrop', async (req, res) => {
    try {
        const items = await StoreBackdrop.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching items' });
    }
});

// GET backdrop by id
router.get('/store_backdrop/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const item = await StoreBackdrop.findById(id);
        if (!item) {
            return res.status(404).json({message: 'Item not found'});
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Server error finding item' });
    }
})


// CREATE backdrop
router.post('/store_backdrop', async (req, res) => {
    const {name, price} = req.body; 

    // validation for user data
    if (!name || typeof name !== 'string' || price == null || typeof price !== 'number'){
        return res.status(400).json({error: 'Invalid item: "name" (string) and "price" (number) are required fields.'})
    }

    try {
        // case-insensitive check to prevent duplicate names
        const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const existing = await StoreBackdrop.findOne({ name: { $regex: `^${escaped}$`, $options: 'i' } });
        if (existing) {
            return res.status(409).json({ error: 'A backdrop with that name already exists.' });
        }

        // create new item in database
        const newItem = await StoreBackdrop.create({ name, price });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Server error creating item' });
    }
});


// UPDATE backdrop
router.put('/store_backdrop/:id', async (req, res) => {
    const id = req.params.id;
    const {name, price} = req.body;

    // validation for user data
    if ((name && typeof name !== 'string') || (price != null && typeof price !== 'number')) {
        return res.status(400).json({error: 'Invalid item: "name" (string) and "price" (number) are required fields.'});
    }

    try {
        // if a new name was provided, ensure it's not used by another item (case-insensitive)
        if (name) {
            const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const existing = await StoreBackdrop.findOne({ name: { $regex: `^${escaped}$`, $options: 'i' } });
            if (existing && existing._id.toString() !== id) {
                return res.status(409).json({ error: 'An item with that name already exists.' });
            }
        }

        const update = {};
        if (name !== undefined) update.name = name;
        if (price !== undefined) update.price = price;

        const updatedItem = await StoreBackdrop.findByIdAndUpdate(id, update, { new: true, runValidators: true });
        if (!updatedItem) {
            return res.status(404).json({message: 'Item not found'});
        }

        res.json({message: 'Item updated successfully', item: updatedItem});
    } catch (error) {
        res.status(500).json({ error: 'Server error updating item' });
    }
});


// DELETE a backdrop
router.delete('/store_backdrop/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedItem = await StoreBackdrop.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({message: 'Item not found'});
        }
        res.json({message: 'Item deleted successfully', item: deletedItem});
    } catch (error) {
        res.status(500).json({ error: 'Server error deleting item' });
    }
})




module.exports = router;