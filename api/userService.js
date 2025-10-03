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

// 1. Get a single user by ID (GET)
// /api/user/:id
app.get('/api/user/:id', (req, res) => {
    const user = users.find(t => t.id === parseInt(req.params.id));
    if(!user) {
        return res.status(404).send('The user with the given ID was not found.');
    }
    res.json(user);
});


// 2. Create user (POST) 
// /api/user/createuser
app.post('/api/user/createuser', (req, res) => {
    const newUser = {
        // in this section, user schema
    }
});

// 3. Update username (PUT)
// /api/user/:id/updateusername
app.put('/api/store/items/:id', (req, res) => {
    const user = users.find(t => t.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).send('The user with the given ID was not found.');
    }

    // Update the actual user properties here
});

// 4. Update user's name (PUT)
// /api/user/:id/updatename
app.put('/api/user/:id/updatename', (req, res) => {
    const user = users.find(t => t.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).send('The user with the given ID was not found.');
    }

    // Update the actual user properties here
});

// 5. Update user's email (PUT)
// /api/user/:id/updateemail
app.put('/api/user/:id/updateemail', (req, res) => {
    const user = users.find(t => t.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).send('The user with the given ID was not found.');
    }
    // Update info here
});

// 6. Delete user's account (DELETE)
// /api/user/:id
app.delete('/api/store/items/:id', (req, res) => {
    const userIndex = users.findIndex(t => t.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).send('The user with the given ID was not found.');
    }
    users.splice(userIndex, 1);
    res.status(204).send();
});

// 7. Update profile icon (PUT)
// /api/user/:id/updateicon
app.put('/api/user/:id/updateicon', (req, res) => {

});

// 8. Update profile banner (PUT)
// /api/user/:id/updatebanner
app.put('/api/user/:id/updatebanner', (req, res) => {

});

// 9. Update profile backdrop (PUT)
// /api/user/:id/updatebackdrop
app.put('/api/user/:id/updatebackdrop', (req, res) => {

});

// 10. Get available icons (GET)
// /api/user/icons
app.get('/api/user/icons', (req, res) => {
    res.json(icons);
});

// 11. Get available banners (GET)
// /api/user/banners
app.get('/api/user/banners', (req, res) => {
    res.json(banners);
});

// 12. Get available backdrops (GET)
// /api/user/backdrops
app.get('/api/user/backdrops', (req, res) => {
    res.json(backdrops);
});