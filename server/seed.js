require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');

const sampleMovies = [
  {
    titleAr: 'فيلم تجريبي 1',
    titleEn: 'Test Movie 1',
    type: 'movie',
    poster: 'https://via.placeholder.com/300x450?text=Movie+1',
    year: 2025,
    duration: '1:45:00',
    genres: ['دراما'],
    description: 'وصف تجريبي للفيلم الأول',
    rating: 4.5,
  },
  {
    titleAr: 'فيلم تجريبي 2',
    titleEn: 'Test Movie 2',
    type: 'movie',
    poster: 'https://via.placeholder.com/300x450?text=Movie+2',
    year: 2024,
    duration: '2:10:00',
    genres: ['أكشن'],
    description: 'وصف تجريبي للفيلم الثاني',
    rating: 4.2,
  },
];

const sampleSeries = [
  {
    titleAr: 'مسلسل تجريبي',
    titleEn: 'Test Series',
    type: 'series',
    poster: 'https://via.placeholder.com/300x450?text=Series',
    year: 2025,
    genres: ['دراما'],
    description: 'وصف تجريبي للمسلسل',
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          { episodeNumber: 1, title: 'الحلقة 1', videoUrl: 'https://example.com/video1', duration: '45:00' },
          { episodeNumber: 2, title: 'الحلقة 2', videoUrl: 'https://example.com/video2', duration: '42:00' },
        ]
      }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Content.deleteMany();
    await Content.insertMany([...sampleMovies, ...sampleSeries]);
    console.log('✅ تم إضافة البيانات التجريبية بنجاح');
    process.exit();
  } catch (error) {
    console.error('❌ خطأ في إضافة البيانات:', error);
    process.exit(1);
  }
};

seedDB();
