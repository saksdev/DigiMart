import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserDashboard from './UserDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx';

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null; // prevent flicker

  return user.isAdmin ? <AdminDashboard user={user} /> : <UserDashboard user={user} />;
}
