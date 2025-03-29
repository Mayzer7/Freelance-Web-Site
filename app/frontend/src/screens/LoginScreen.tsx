import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, User, Lock, ArrowRight, Mail } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { message } from "antd";

function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      let response;
      if (isLogin) {
        response = await axios.post("http://127.0.0.1:8000/api/users/login/", {
          username: formData.username,
          password: formData.password,
        });
      } else {
        if (formData.password !== formData.password_confirm) {
          message.error("Пароли не совпадают");
          setLoading(false);
          return;
        }
        response = await axios.post("http://127.0.0.1:8000/api/users/register/", formData);
      }
  
      console.log("Ответ сервера:", response.data);

      localStorage.setItem("token", response.data.access);
      message.success(isLogin ? "Вход выполнен успешно!" : "Регистрация прошла успешно!");
  
      // Ждем чуть-чуть перед навигацией
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          const errorData = error.response.data as Record<string, any>;
          Object.values(errorData).forEach((err: string) => message.error(err));
        }
      } else {
        message.error(isLogin ? "Ошибка входа" : "Ошибка регистрации");
      }
    }
    setLoading(false);
  };
  
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col">
      <Toaster position="top-right" />
      
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <Link to="/" className="flex items-center space-x-2 w-fit">
          <Code2 className="w-8 h-8 text-blue-400" />
          <span className="text-xl font-bold hover:text-blue-400 transition-colors">
            FreelanceHub
          </span>
        </Link>
      </nav>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl transform -rotate-6"></div>
            <div className="relative bg-slate-800/90 p-8 rounded-2xl backdrop-blur-sm border border-slate-700 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {isLogin ? 'Добро пожаловать!' : 'Регистрация'}
                </h2>
                <p className="text-gray-400">
                  {isLogin
                    ? 'Войдите в аккаунт'
                    : 'Врывайся в мир фриланса!'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Имя пользователя"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      required
                    />
                  </div>

                  {!isLogin && (
                    <>
                      <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                            required
                          />
                        </div>
                    </>
                  )}

                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Пароль"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      required
                    />
                  </div>

                  {!isLogin && (
                    <>
                      <div className="relative group">  
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type="password"
                          name="password_confirm"
                          value={formData.password_confirm}
                          onChange={handleInputChange}
                          placeholder="Повторите пароль"
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                          required
                        />
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transform hover:scale-[1.02] transition-all duration-200"
                >
                  <span>{isLogin ? 'Войти' : 'Зарегистрироваться'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  {isLogin ? "У вас нет аккаунта?" : 'У вас уже есть аккаунт?'}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-blue-400 hover:text-blue-300 font-medium"
                  >
                    {isLogin ? 'Регистрация' : 'Войти'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;