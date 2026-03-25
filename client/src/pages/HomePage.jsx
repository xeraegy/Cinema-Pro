import React, { useState, useEffect } from 'react';
import Slider from '../components/Slider';
import { getLatestMovies, getLatestSeries } from '../services/contentService';

const HomePage = () => {
  const [latestMovies, setLatestMovies] = useState([]);
  const [latestSeries, setLatestSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesRes = await getLatestMovies();
        setLatestMovies(moviesRes.data);
        const seriesRes = await getLatestSeries();
        setLatestSeries(seriesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      <Slider title="أحدث الأفلام" items={latestMovies} type="movie" />
      <Slider title="أحدث المسلسلات" items={latestSeries} type="series" />
    </div>
  );
};

export default HomePage;
