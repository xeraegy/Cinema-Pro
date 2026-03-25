const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  episodeNumber: { type: Number, required: true },
  title: { type: String, default: '' },
  videoUrl: { type: String, required: true },
  duration: { type: String, default: '' },
});

const seasonSchema = new mongoose.Schema({
  seasonNumber: { type: Number, required: true },
  episodes: [episodeSchema],
});

const contentSchema = new mongoose.Schema({
  titleAr: { type: String, required: true },
  titleEn: { type: String, default: '' },
  type: { type: String, enum: ['movie', 'series'], required: true },
  poster: { type: String, default: '' },
  cover: { type: String, default: '' },
  year: { type: Number, default: new Date().getFullYear() },
  duration: { type: String, default: '' },
  genres: [{ type: String }],
  description: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  seasons: [seasonSchema],
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
