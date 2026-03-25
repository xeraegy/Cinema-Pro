import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">Cinema Pro</Link>
        <div className="nav-links">
          <Link to="/">الرئيسية</Link>
          <Link to="/movies">أفلام</Link>
          <Link to="/series">مسلسلات</Link>
          {user?.role === 'admin' && <Link to="/admin" className="admin-link">لوحة التحكم</Link>}
        </div>
        <div className="nav-auth">
          {user ? (
            <>
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="logout-btn">تسجيل خروج</button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link-btn">دخول</Link>
              <Link to="/register" className="auth-link-btn register">تسجيل</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
