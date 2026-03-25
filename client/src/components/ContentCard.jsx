import React from 'react';
import { Link } from 'react-router-dom';

const ContentCard = ({ item, type }) => {
  return (
    <div className="content-card">
      <Link to={`/${type === 'movie' ? 'movie' : 'series'}/${item._id}`}>
        <img src={item.poster || '/placeholder.jpg'} alt={item.titleAr} />
        <div className="info">
          <h3>{item.titleAr}</h3>
          {type === 'movie' && <span>{item.year} • {item.duration}</span>}
          {type === 'series' && <span>{item.year}</span>}
        </div>
      </Link>
    </div>
  );
};

export default ContentCard;
