// models/images_inventory.js
const mongoose = require('mongoose');

const ImagesInventorySchema = new mongoose.Schema(
  {
    // Optional human-friendly name
    title: { type: String, trim: true },

    // Alt text for accessibility
    alt: { type: String, trim: true },

    // If you store files on disk or a CDN, keep the relative/absolute URL here
    url: { type: String, trim: true },

    // If you want to store the image itself in MongoDB, use these:
    data: Buffer,                 // binary image data (optional)
    contentType: { type: String } // e.g. 'image/jpeg', 'image/png'
  },
  {
    timestamps: true,
    collection: 'images_inventory'
  }
);

// Reuse model if it’s already compiled (nodemon/dev)
module.exports =
  mongoose.models.ImagesInventory ||
  mongoose.model('ImagesInventory', ImagesInventorySchema);
