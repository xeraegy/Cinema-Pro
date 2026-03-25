const express = require('express');
const router = express.Router();
const {
  getLatestMovies,
  getLatestSeries,
  getLatestEpisodes,
  getContentById,
  searchContent,
  getByGenre,
} = require('../controllers/contentController');

router.get('/movies/latest', getLatestMovies);
router.get('/series/latest', getLatestSeries);
router.get('/episodes/latest', getLatestEpisodes);
router.get('/search', searchContent);
router.get('/genre/:genre', getByGenre);
router.get('/:id', getContentById);

module.exports = router;
