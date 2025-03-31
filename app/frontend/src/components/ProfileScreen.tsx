import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Code2,
  LogOut,
  User as UserIcon,
  Mail,
  Wallet,
  Edit,
  Star,
  Briefcase,
  Globe,
  Link as IconLink,
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface UserProfile {
  avatar: string | null;
  username: string;
  email: string;
  balance: string | number;
  bio: string;
  experience_level: string;
  hourly_rate: string | number;
  portfolio_url: string;
  github_url: string;
  linkedin_url: string;
  rating: string | number;
  completed_projects: number;
  specialization: string;
  languages: string[];
  available_for_hire: boolean;
}

function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/auth/profile/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserProfile(response.data);
      } catch (error) {
        toast.error("Ошибка при загрузке профиля");
        localStorage.removeItem("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    setAvatarFile(file);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/auth/upload-avatar/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Аватар обновлён!');
      setUserProfile((prev) => prev ? { ...prev, avatar: URL.createObjectURL(file) } : prev);
    } catch (error) {
      toast.error('Ошибка при загрузке аватара');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Toaster position="top-right" />
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Code2 className="w-8 h-8 text-blue-400" />
          <Link to="/">
            <span className="text-xl font-bold">FreelanceHub</span>
          </Link>
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
        <div className="max-w-2xl mx-auto bg-slate-800/90 p-8 rounded-2xl border border-slate-700 shadow-xl">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Профиль пользователя
          </h1>

          {/* Аватар + Кнопка загрузки */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={userProfile?.avatar || '/default-avatar.png'}
              alt="Аватар пользователя"
              className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-lg object-cover"
            />
            <label className="mt-4 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Изменить аватар
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </label>
          </div>

          <div className="space-y-4">
            <ProfileField
              icon={<UserIcon />}
              label="Имя пользователя"
              value={userProfile?.username}
            />
            <ProfileField
              icon={<Mail />}
              label="Email"
              value={userProfile?.email}
            />
            <ProfileField
              icon={<Wallet />}
              label="Баланс"
              value={`${userProfile?.balance} ₽`}
            />
            <ProfileField
              icon={<Briefcase />}
              label="Опыт"
              value={userProfile?.experience_level}
            />
            <ProfileField
              icon={<Star />}
              label="Рейтинг"
              value={userProfile?.rating}
            />
            <ProfileField
              icon={<Globe />}
              label="Специализация"
              value={userProfile?.specialization}
            />
            <ProfileField
              icon={<Edit />}
              label="Навыки"
              value={userProfile?.languages?.join(", ")}
            />
            <ProfileField
              icon={<IconLink />}
              label="Портфолио"
              value={userProfile?.portfolio_url}
              link
            />
            <ProfileField
              icon={<IconLink />}
              label="GitHub"
              value={userProfile?.github_url}
              link
            />
            <ProfileField
              icon={<IconLink />}
              label="LinkedIn"
              value={userProfile?.linkedin_url}
              link
            />
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/edit-profile")}
              className="px-6 py-3 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors flex items-center"
            >
              <Edit className="w-5 h-5" />
              <span>Редактировать профиль</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileField({
  icon,
  label,
  value,
  link,
}: {
  icon: JSX.Element;
  label: string;
  value?: string | number;
  link?: boolean;
}) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-slate-900/50 rounded-lg">
      {icon}
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        {link && value ? (
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-400 hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="font-semibold">{value || "Не указано"}</p>
        )}
      </div>
    </div>
  );
}

export default ProfileScreen;
