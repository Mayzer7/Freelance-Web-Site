import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, LogOut, Save, User } from 'lucide-react';

interface UserProfile {
  avatar?: string;
  fullName: string;
  specialization: string;
  hourlyRate: string;
  description: string;
  skills: string[];
}

export default function UserProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    specialization: '',
    hourlyRate: '',
    description: '',
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/users/profile/', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        if (data.avatar) {
          setAvatarPreview(data.avatar);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/users/logout/', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      if (key === 'skills') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      const response = await fetch('/api/profile/', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        // Обновляем профиль после успешного сохранения
        fetchUserProfile();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Профиль фрилансера</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Выйти</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-700">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-full h-full p-6 text-slate-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Ваше полное имя"
                  value={profile.fullName}
                  onChange={e => setProfile({...profile, fullName: e.target.value})}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2 mb-3"
                />
                <input
                  type="text"
                  placeholder="Специализация"
                  value={profile.specialization}
                  onChange={e => setProfile({...profile, specialization: e.target.value})}
                  className="w-full bg-slate-700 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            {/* Rate and Description */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Почасовая ставка (₽)"
                value={profile.hourlyRate}
                onChange={e => setProfile({...profile, hourlyRate: e.target.value})}
                className="w-full bg-slate-700 rounded-lg px-4 py-2"
              />
              <textarea
                placeholder="Расскажите о себе и своем опыте..."
                value={profile.description}
                onChange={e => setProfile({...profile, description: e.target.value})}
                className="w-full bg-slate-700 rounded-lg px-4 py-2 h-32 resize-none"
              />
            </div>

            {/* Skills Section */}
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Добавить навык"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  className="flex-1 bg-slate-700 rounded-lg px-4 py-2"
                  onKeyPress={e => e.key === 'Enter' && handleAddSkill()}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Добавить
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span
                    key={skill}
                    className="bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-blue-300 hover:text-blue-100"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Сохранить изменения</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}