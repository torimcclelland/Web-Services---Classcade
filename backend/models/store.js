const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
}, { versionKey: false });

// separate models that map to different collections
const StoreIcon = mongoose.model('StoreIcon', storeSchema, 'Store_Icon');
const StoreBanner = mongoose.model('StoreBanner', storeSchema, 'Store_Banner');
const StoreBackdrop = mongoose.model('StoreBackdrop', storeSchema, 'Store_Backdrop');

module.exports = {
  StoreIcon,
  StoreBanner,
  StoreBackdrop
};