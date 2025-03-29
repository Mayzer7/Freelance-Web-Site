import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Токен в Dashboard:", token); // Проверяем, есть ли токен
    
    if (!token) {
      navigate("/login");
      return;
    }
  
    axios
      .get("http://127.0.0.1:8000/api/users/user/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } // Используем refresh токен
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  // Функция выхода из аккаунта
  const handleLogout = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/users/logout/", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
    
    localStorage.removeItem("token"); // Удаляем токен
    navigate("/login"); // Переход на страницу логина
  };
  
  if (loading) {
    return <div className="text-white text-center mt-10">Загрузка...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-white text-2xl font-bold">
        {isAuthenticated ? "Вы успешно вошли в аккаунт!" : "Ошибка авторизации"}
      </div>
      {isAuthenticated && (
        <button 
          onClick={handleLogout} 
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Выйти
        </button>
      )}
    </div>
  );
};

export default Dashboard;
