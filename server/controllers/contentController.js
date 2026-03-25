const Content = require('../models/Content');

exports.getLatestMovies = async (req, res) => {
  try {
    const movies = await Content.find({ type: 'movie' })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('titleAr poster year duration rating');
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLatestSeries = async (req, res) => {
  try {
    const series = await Content.find({ type: 'series' })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('titleAr poster year');
    res.json(series);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLatestEpisodes = async (req, res) => {
  try {
    const series = await Content.find({ type: 'series' }, 'titleAr poster seasons');
    let episodes = [];
    series.forEach(ser => {
      ser.seasons.forEach(season => {
        season.episodes.forEach(ep => {
          episodes.push({
            contentId: ser._id,
            contentTitle: ser.titleAr,
            poster: ser.poster,
            season: season.seasonNumber,
            episode: ep.episodeNumber,
            title: ep.title,
            videoUrl: ep.videoUrl,
            duration: ep.duration,
            createdAt: ep._id.getTimestamp(),
          });
        });
      });
    });
    episodes.sort((a, b) => b.createdAt - a.createdAt);
    res.json(episodes.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'المحتوى غير موجود' });
    }
    content.views += 1;
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchContent = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const results = await Content.find({
      $or: [
        { titleAr: { $regex: q, $options: 'i' } },
        { titleEn: { $regex: q, $options: 'i' } }
      ]
    }).limit(30);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByGenre = async (req, res) => {
  try {
    const genre = req.params.genre;
    const contents = await Content.find({ genres: genre }).limit(20);
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
