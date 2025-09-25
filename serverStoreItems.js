//serverStoreItems.js
//a GET api service that fetches items from the store
//the store sells virtual cosmetics to users and this
//logic helps us gather the current inventory

//setting up express environment
const express = require('express');
const app = express();
const PORT = 3000;

//middleware used in parsing json file format
app.use(express.json());

//in-memory store inventory
const storeItems = [
    {id: 1, name: 'Blue Banner', price: 1.99},
    {id: 2, name: 'Pink Stars Frame', price: 2.99},
    {id: 3, name: 'Worm Avatar', price: 0.99}
]

//GET endpoint that retrives the cosmetic items from the store
app.get('/api/store/items', (req, res) => {
    res.json(storeItems);
});
// DELETE a cosmetic item
app.delete('/api/store/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = storeItems.findIndex(item => item.id === id);
    if (index === -1) {
        return res.status(404).json({message: 'Item not found'});
    }
    const deletedItem = store storeItems.splice(index, 1);
    res.json({message: 'Item deleted successfully', item: deletedItem[0]});
})

// POST endpoint to put an item in the store
app.post('/api/store/items', (req, res) => {
    const {name, price} = req.body; 

    // validation for user data
    if (!name || typeof name !== 'string' || price == null  | typeof price !== 'number'){
        return res.status(400).json({error: 'Invalid item. Name and price are required.'})
    }

    // create new item
    const newId = storeItems.reduce((max, items) => Math.max(max, items.id), 0) + 1;
    const newItem = {id: newId, name, price};

    // add new item to the store list
    storeItems.push(newItem);

    // respond with 'created' status code
    res.status(201).json(newItem);
});

//output message to confirm the service is running locally
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));