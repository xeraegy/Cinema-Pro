import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createContent, updateContent } from '../../services/adminService';
import { getContentById } from '../../services/contentService';
import './AdminDashboard.css';

const AdminContentForm = () => {
  const { id } = useParams(); // إذا كان id موجوداً، نكون في وضع التعديل
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    type: 'movie',
    poster: '',
    cover: '',
    year: new Date().getFullYear(),
    duration: '',
    genres: [],
    description: '',
    rating: 0,
  });
  const [genreInput, setGenreInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchContent = async () => {
        try {
          const res = await getContentById(id);
          const data = res.data;
          setFormData({
            titleAr: data.titleAr,
            titleEn: data.titleEn,
            type: data.type,
            poster: data.poster,
            cover: data.cover,
            year: data.year,
            duration: data.duration,
            genres: data.genres,
            description: data.description,
            rating: data.rating,
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchContent();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addGenre = () => {
    if (genreInput.trim() && !formData.genres.includes(genreInput.trim())) {
      setFormData({ ...formData, genres: [...formData.genres, genreInput.trim()] });
      setGenreInput('');
    }
  };
  const removeGenre = (genre) => {
    setFormData({ ...formData, genres: formData.genres.filter(g => g !== genre) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updateContent(id, formData);
        setMessage('تم التحديث بنجاح');
      } else {
        await createContent(formData);
        setMessage('تم الإضافة بنجاح');
      }
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      setMessage('حدث خطأ');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h1>{id ? 'تعديل محتوى' : 'إضافة محتوى جديد'}</h1>
      {message && <div className="admin-message">{message}</div>}
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>العنوان (عربي)</label>
          <input type="text" name="titleAr" value={formData.titleAr} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>العنوان (إنجليزي)</label>
          <input type="text" name="titleEn" value={formData.titleEn} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>النوع</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="movie">فيلم</option>
            <option value="series">مسلسل</option>
          </select>
        </div>
        <div className="form-group">
          <label>رابط الصورة (ملصق)</label>
          <input type="text" name="poster" value={formData.poster} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>رابط صورة الخلفية</label>
          <input type="text" name="cover" value={formData.cover} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>السنة</label>
          <input type="number" name="year" value={formData.year} onChange={handleChange} />
        </div>
        {formData.type === 'movie' && (
          <div className="form-group">
            <label>المدة (مثال: 1:45:00)</label>
            <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
          </div>
        )}
        <div className="form-group">
          <label>التصنيفات (أدخل تصنيفاً واضغط إضافة)</label>
          <div className="genre-input">
            <input type="text" value={genreInput} onChange={(e) => setGenreInput(e.target.value)} />
            <button type="button" onClick={addGenre}>إضافة</button>
          </div>
          <div className="genres-list">
            {formData.genres.map(g => (
              <span key={g} className="genre-tag">{g} <button type="button" onClick={() => removeGenre(g)}>×</button></span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>الوصف</label>
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>التقييم (0-10)</label>
          <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading} className="submit-btn">{loading ? 'جاري الحفظ...' : 'حفظ'}</button>
      </form>
    </div>
  );
};

export default AdminContentForm;
