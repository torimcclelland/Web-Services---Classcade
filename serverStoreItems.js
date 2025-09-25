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

//output message to confirm the service is running locally
app.listen(PORT, () => console.log('Server running on port ${PORT}'));