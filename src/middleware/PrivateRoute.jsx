import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return navigate('/login');
    }
    
    if (Object.keys(user).length === 0 && !loading) { 
      return navigate('/login');
    }

    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (Object.keys(user).length === 0) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
