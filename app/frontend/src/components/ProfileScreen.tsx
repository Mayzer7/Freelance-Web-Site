import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, LogOut, User as UserIcon, Mail, Wallet } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface UserData {
  username: string;
  email: string;
  balance: string | number;
}

function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        toast.error('Ошибка при загрузке профиля');
        localStorage.removeItem('token');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
      </div>
    );
  }

  const formatBalance = (balance: string | number | undefined) => {
    if (balance === undefined) return '0.00';
    const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance;
    return numBalance.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Toaster position="top-right" />
      
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Code2 className="w-8 h-8 text-blue-400" />
          <span className="text-xl font-bold">FreelanceHub</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Выйти</span>
        </button>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl transform -rotate-6"></div>
            <div className="relative bg-slate-800/90 p-8 rounded-2xl backdrop-blur-sm border border-slate-700 shadow-xl">
              <h1 className="text-3xl font-bold mb-8 text-center">Профиль пользователя</h1>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-slate-900/50 rounded-lg">
                  <UserIcon className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Имя пользователя</p>
                    <p className="font-semibold">{userData?.username}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-slate-900/50 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold">{userData?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-slate-900/50 rounded-lg">
                  <Wallet className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Баланс</p>
                    <p className="font-semibold">{formatBalance(userData?.balance)} ₽</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfileScreen;