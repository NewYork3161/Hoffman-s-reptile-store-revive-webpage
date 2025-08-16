// seeds.js
require('dotenv').config();
const mongoose = require('mongoose');
const ImagesInventory = require('./models/images_inventory');

const MONGODB_URI = process.env.MONGODB_URI;

const seedImages = [
  {
    title: "Icon Strip",
    alt: "Reptile Icons",
    url: "/images/index_01.jpg"
  },
  {
    title: "Storefront and Facebook",
    alt: "Storefront and Facebook",
    url: "/images/index_02.jpg"
  },
  {
    title: "Lizard",
    alt: "Lizard",
    url: "/images/index_03.jpg"
  },
  {
    title: "Additional Reptile Image",
    alt: "Additional reptile image",
    url: "/images/index_004.jpg"
  },
  {
    title: "Logo",
    alt: "Hoffmann's Reptile Store Logo",
    url: "/images/Logo.gif"
  }
];

async function seedDB() {
  try {
    if (!MONGODB_URI) {
      throw new Error("⚠️  MONGODB_URI is missing in .env file");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("✓ MongoDB connected");

    // Clear collection first
    await ImagesInventory.deleteMany({});
    console.log("✓ Old image inventory cleared");

    // Insert new seed data
    await ImagesInventory.insertMany(seedImages);
    console.log("✓ Database seeded with images");

    // Close connection
    await mongoose.connection.close();
    console.log("✓ Connection closed");
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seedDB();
