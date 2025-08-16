// app.js
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const ImagesInventory = require('./models/images_inventory');

const app = express();

/* ---------- View engine (EJS) ---------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ---------- Static assets ---------- */
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- Parsers ---------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ---------- Dev logging ---------- */
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* ---------- Routes ---------- */
// Home -> renders views/index.ejs with images from Mongo
app.get('/', async (req, res) => {
  try {
    const images = await ImagesInventory.find({}).lean();

    // Build a lookup by title for direct access in EJS
    const imgByTitle = {};
    for (const im of images) {
      if (im && im.title) imgByTitle[im.title] = im;
    }

    console.log('DB images loaded for / :', images.length);

    res.render('index', {
      title: "Hoffmann's Reptile Store",
      images,
      img: imgByTitle
    });
  } catch (err) {
    console.error('Error loading images:', err);
    res.render('index', {
      title: "Hoffmann's Reptile Store",
      images: [],
      img: {}
    });
  }
});

/* ---------- Debug JSON route ---------- */
// Visit http://localhost:3000/debug/images to see what is in the DB
app.get('/debug/images', async (req, res) => {
  try {
    const docs = await ImagesInventory.find({}).lean();
    res.json({ count: docs.length, docs });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ---------- Sitemap route (serves root-level sitemap.xml) ---------- */
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  fs.createReadStream(path.join(__dirname, 'sitemap.xml')).pipe(res);
});

/* ---------- 404 fallback ---------- */
app.use((req, res) => {
  res.status(404).send('Page not found');
});

/* ---------- Boot ---------- */
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || '';

async function start() {
  try {
    if (MONGODB_URI) {
      await mongoose.connect(MONGODB_URI);
      console.log('✓ MongoDB connected');
    } else {
      console.warn('⚠️  No MONGODB_URI provided. Starting without DB connection.');
    }

    app.listen(PORT, () => {
      console.log(`✓ Server running: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

start();
