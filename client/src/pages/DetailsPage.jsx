import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getContentById } from '../services/contentService';
import './DetailsPage.css';

const DetailsPage = () => {
  const { id, type } = useParams(); // type: movie or series from route
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await getContentById(id);
        setContent(res.data);
        // تعيين الحلقة الأولى افتراضياً إذا كان مسلسلاً
        if (res.data.type === 'series' && res.data.seasons?.length > 0) {
          const firstSeason = res.data.seasons[0];
          setSelectedSeason(0);
          if (firstSeason.episodes?.length > 0) {
            setSelectedEpisode(firstSeason.episodes[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  const handleSeasonChange = (seasonIndex) => {
    setSelectedSeason(seasonIndex);
    const season = content.seasons[seasonIndex];
    if (season?.episodes?.length > 0) {
      setSelectedEpisode(season.episodes[0]);
    } else {
      setSelectedEpisode(null);
    }
  };

  const handleEpisodeSelect = (episode) => {
    setSelectedEpisode(episode);
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (!content) return <div className="error">المحتوى غير موجود</div>;

  return (
    <div className="details-page">
      <div className="hero" style={{ backgroundImage: `url(${content.cover || content.poster})` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{content.titleAr}</h1>
            <div className="meta">
              <span>{content.year}</span>
              {content.type === 'movie' && <span>{content.duration}</span>}
              {content.rating > 0 && <span>⭐ {content.rating}</span>}
            </div>
            <p className="description">{content.description}</p>
            <div className="genres">
              {content.genres?.map((g, i) => <span key={i} className="genre">{g}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div className="player-section">
        <h2>المشاهدة</h2>
        {content.type === 'movie' ? (
          <div className="video-player">
            {/* هنا يمكن وضع مشغل فيديو حقيقي، نستخدم placeholder الآن */}
            <div className="video-placeholder">
              <iframe
                width="100%"
                height="400"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                title="Video player"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ) : (
          <div className="series-player">
            {selectedEpisode ? (
              <div className="video-player">
                <div className="episode-title">
                  <h3>الحلقة {selectedEpisode.episodeNumber}: {selectedEpisode.title}</h3>
                </div>
                <div className="video-placeholder">
                  <iframe
                    width="100%"
                    height="400"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                    title="Video player"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : (
              <p>لا توجد حلقات متاحة</p>
            )}

            {/* قائمة المواسم والحلقات */}
            <div className="seasons-episodes">
              <div className="seasons-tabs">
                {content.seasons?.map((season, idx) => (
                  <button
                    key={idx}
                    className={selectedSeason === idx ? 'active' : ''}
                    onClick={() => handleSeasonChange(idx)}
                  >
                    الموسم {season.seasonNumber}
                  </button>
                ))}
              </div>
              {content.seasons && content.seasons[selectedSeason] && (
                <div className="episodes-list">
                  {content.seasons[selectedSeason].episodes?.map((ep, idx) => (
                    <div
                      key={idx}
                      className={`episode-item ${selectedEpisode?.episodeNumber === ep.episodeNumber ? 'active' : ''}`}
                      onClick={() => handleEpisodeSelect(ep)}
                    >
                      <span className="episode-num">الحلقة {ep.episodeNumber}</span>
                      <span className="episode-title">{ep.title}</span>
                      {ep.duration && <span className="episode-duration">{ep.duration}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsPage;
