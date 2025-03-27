import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, User, Lock, ArrowRight } from 'lucide-react';

function LoginScren() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login/register logic here
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col">
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
                      placeholder="Username"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      required
                    />
                  </div>

                  {!isLogin && (
                    <div className="relative group">
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
                  )}

                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      required
                    />
                  </div>
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

export default LoginScren;