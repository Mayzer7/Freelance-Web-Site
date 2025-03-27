import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await axios.get('/api/users/csrf/', { withCredentials: true });
        axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
      } catch (error) {
        console.error('Ошибка при получении CSRF-токена:', error);
      }
    };

    fetchCSRFToken();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout/', {}, { withCredentials: true });
      console.log('Logout successful');
      
      // Удаляем CSRF-токен после выхода
      delete axios.defaults.headers.common['X-CSRFToken'];

      navigate('/login'); // Перенаправление
    } catch (error: any) {
      console.error('Logout error:', error.response?.data || error.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
    >
      LOGOUT
    </button>
  );
};

export default LogoutButton;
