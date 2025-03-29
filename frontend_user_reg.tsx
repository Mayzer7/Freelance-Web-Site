import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirm) {
      message.error("Пароли не совпадают");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", formData);
      message.success("Регистрация прошла успешно!");
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.data) {
        Object.values(error.response.data).forEach((err) => message.error(err));
      } else {
        message.error("Ошибка регистрации");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Регистрация</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Имя пользователя"
            required
            className="w-full p-3 bg-gray-700 text-white rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
            className="w-full p-3 bg-gray-700 text-white rounded"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Пароль"
            required
            className="w-full p-3 bg-gray-700 text-white rounded"
          />
          <input
            type="password"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleInputChange}
            placeholder="Подтвердите пароль"
            required
            className="w-full p-3 bg-gray-700 text-white rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded"
            disabled={loading}
          >
            {loading ? "Загрузка..." : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
