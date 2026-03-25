import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createContent, updateContent, getContentById } from '../services/adminService';
import './AdminPages.css';

const ContentFormPage = () => {
  const { id } = useParams(); // إذا كان id موجوداً، نكون في وضع التعديل
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    seasons: []
  });
  const [genresInput, setGenresInput] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    if (id) {
      // جلب البيانات للتعديل
      const fetchContent = async () => {
        try {
          const res = await getContentById(id);
          const data = res.data;
          setFormData({
            titleAr: data.titleAr || '',
            titleEn: data.titleEn || '',
            type: data.type || 'movie',
            poster: data.poster || '',
            cover: data.cover || '',
            year: data.year || new Date().getFullYear(),
            duration: data.duration || '',
            genres: data.genres || [],
            description: data.description || '',
            rating: data.rating || 0,
            seasons: data.seasons || []
          });
          setGenresInput((data.genres || []).join(', '));
        } catch (err) {
          console.error('Error fetching content:', err);
        }
      };
      fetchContent();
    }
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenresChange = (e) => {
    const val = e.target.value;
    setGenresInput(val);
    const genresArray = val.split(',').map(g => g.trim()).filter(g => g);
    setFormData(prev => ({ ...prev, genres: genresArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updateContent(id, formData);
      } else {
        await createContent(formData);
      }
      navigate('/admin/contents');
    } catch (err) {
      console.error('Error saving content:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h1>{id ? 'تعديل محتوى' : 'إضافة محتوى جديد'}</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>العنوان بالعربية *</label>
            <input type="text" name="titleAr" value={formData.titleAr} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>العنوان بالإنجليزية</label>
            <input type="text" name="titleEn" value={formData.titleEn} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>النوع *</label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="movie">فيلم</option>
              <option value="series">مسلسل</option>
            </select>
          </div>
          <div className="form-group">
            <label>السنة</label>
            <input type="number" name="year" value={formData.year} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>رابط الملصق (Poster)</label>
            <input type="text" name="poster" value={formData.poster} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>رابط صورة الغلاف (Cover)</label>
            <input type="text" name="cover" value={formData.cover} onChange={handleChange} />
          </div>
        </div>
        {formData.type === 'movie' && (
          <div className="form-group">
            <label>المدة (مثال: 2:10:00)</label>
            <input type="text" name="duration" value={formData.duration} onChange={handleChange} />
          </div>
        )}
        <div className="form-group">
          <label>التصنيفات (مفصولة بفواصل)</label>
          <input type="text" value={genresInput} onChange={handleGenresChange} placeholder="مثال: دراما, أكشن, كوميدي" />
        </div>
        <div className="form-group">
          <label>الوصف</label>
          <textarea name="description" rows="4" value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>التقييم (0-10)</label>
          <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'جاري الحفظ...' : 'حفظ'}
        </button>
      </form>
    </div>
  );
};

export default ContentFormPage;
