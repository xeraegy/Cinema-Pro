import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getLatestMovies, getLatestSeries } from '../../services/contentService';
import { deleteContent } from '../../services/adminService';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesRes = await getLatestMovies();
        const seriesRes = await getLatestSeries();
        setMovies(moviesRes.data);
        setSeries(seriesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id, type) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المحتوى؟')) return;
    try {
      await deleteContent(id);
      setMessage('تم الحذف بنجاح');
      // تحديث القوائم
      if (type === 'movie') setMovies(movies.filter(m => m._id !== id));
      else setSeries(series.filter(s => s._id !== id));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('فشل الحذف');
    }
  };

  if (loading) return <div>جاري التحميل...</div>;
  if (!user || user.role !== 'admin') return <div>غير مصرح لك بالدخول</div>;

  return (
    <div className="admin-dashboard">
      <h1>لوحة تحكم المشرف</h1>
      {message && <div className="admin-message">{message}</div>}
      <div className="admin-actions">
        <Link to="/admin/content/new" className="btn-add">+ إضافة محتوى جديد</Link>
      </div>
      <div className="admin-sections">
        <div className="admin-section">
          <h2>الأفلام</h2>
          <div className="admin-table">
            <table>
              <thead>
                <tr><th>العنوان</th><th>السنة</th><th>المدة</th><th>الإجراءات</th></tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <tr key={movie._id}>
                    <td>{movie.titleAr}</td>
                    <td>{movie.year}</td>
                    <td>{movie.duration}</td>
                    <td>
                      <Link to={`/admin/content/edit/${movie._id}`} className="btn-edit">تعديل</Link>
                      <button onClick={() => handleDelete(movie._id, 'movie')} className="btn-delete">حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="admin-section">
          <h2>المسلسلات</h2>
          <div className="admin-table">
            <table>
              <thead><tr><th>العنوان</th><th>السنة</th><th>الإجراءات</th></tr></thead>
              <tbody>
                {series.map(ser => (
                  <tr key={ser._id}>
                    <td>{ser.titleAr}</td>
                    <td>{ser.year}</td>
                    <td>
                      <Link to={`/admin/content/edit/${ser._id}`} className="btn-edit">تعديل</Link>
                      <button onClick={() => handleDelete(ser._id, 'series')} className="btn-delete">حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
