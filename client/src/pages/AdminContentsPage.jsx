import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAllContents, deleteContent } from '../services/adminService';
import './AdminPages.css';

const AdminContentsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchContents();
  }, [user, navigate]);

  const fetchContents = async () => {
    try {
      const res = await getAllContents();
      setContents(res.data);
    } catch (err) {
      console.error('Error fetching contents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المحتوى؟')) {
      try {
        await deleteContent(id);
        fetchContents();
      } catch (err) {
        console.error('Error deleting:', err);
      }
    }
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>لوحة التحكم - إدارة المحتوى</h1>
        <Link to="/admin/contents/new" className="btn-add">+ إضافة جديد</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>الصورة</th>
            <th>العنوان</th>
            <th>النوع</th>
            <th>السنة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {contents.map(content => (
            <tr key={content._id}>
              <td><img src={content.poster || '/placeholder.jpg'} alt={content.titleAr} width="50" /></td>
              <td>{content.titleAr}</td>
              <td>{content.type === 'movie' ? 'فيلم' : 'مسلسل'}</td>
              <td>{content.year}</td>
              <td>
                <Link to={`/admin/contents/edit/${content._id}`} className="btn-edit">تعديل</Link>
                <button onClick={() => handleDelete(content._id)} className="btn-delete">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminContentsPage;
