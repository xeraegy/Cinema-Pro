import React from 'react';
import ContentCard from './ContentCard';

const Slider = ({ title, items, type }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="slider-section">
      <h2>{title}</h2>
      <div className="slider">
        {items.map(item => (
          <ContentCard key={item._id} item={item} type={type} />
        ))}
      </div>
    </div>
  );
};

export default Slider;
