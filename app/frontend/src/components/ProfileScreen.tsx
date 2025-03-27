import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, MapPin, Link as LinkIcon, Github, Linkedin, Twitter, Globe } from 'lucide-react';
import LogoutButton from './LogoutButton';

interface ProfileData {
  bio: string;
  avatar: string;
  title: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  skills: string[];
  experience: string;
  education: string;
  portfolio_items: Array<{
    title: string;
    description: string;
    url: string;
  }>;
  hourly_rate: number;
  available_for_hire: boolean;
}

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileData>();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile/', {
          withCredentials: true
        });
        setProfile(response.data);
        // Set form values
        Object.entries(response.data).forEach(([key, value]) => {
          setValue(key as keyof ProfileData, value as ProfileData[keyof ProfileData]);
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data: ProfileData) => {
    try {
      const response = await axios.put('/api/users/profile/', data, {
        withCredentials: true
      });
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profile && !isEditing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {!isEditing ? (
          // View Mode
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{profile?.title || 'Add Your Title'}</h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{profile?.location || 'Add Location'}</span>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Edit Profile
                </button>

                <LogoutButton /> {/* Используем компонент вместо обычной кнопки */}
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="text-xl font-semibold mb-4">About Me</h2>
              <p className="text-gray-700">{profile?.bio || 'Add your bio'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Availability</h2>
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-gray-600" />
                  <span className="text-gray-700">
                    {profile?.available_for_hire ? 'Available for hire' : 'Not available'}
                    {profile?.hourly_rate && ` - $${profile.hourly_rate}/hr`}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-4">Social Links</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profile?.github && (
                  <a href={profile.github} className="flex items-center text-gray-600 hover:text-gray-900">
                    <Github className="h-5 w-5 mr-2" />
                    GitHub
                  </a>
                )}
                {profile?.linkedin && (
                  <a href={profile.linkedin} className="flex items-center text-gray-600 hover:text-gray-900">
                    <Linkedin className="h-5 w-5 mr-2" />
                    LinkedIn
                  </a>
                )}
                {profile?.twitter && (
                  <a href={profile.twitter} className="flex items-center text-gray-600 hover:text-gray-900">
                    <Twitter className="h-5 w-5 mr-2" />
                    Twitter
                  </a>
                )}
                {profile?.website && (
                  <a href={profile.website} className="flex items-center text-gray-600 hover:text-gray-900">
                    <Globe className="h-5 w-5 mr-2" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Professional Title</label>
              <input
                type="text"
                {...register('title')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                {...register('location')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                {...register('bio')}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
              <input
                type="text"
                {...register('skills')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
                <input
                  type="number"
                  {...register('hourly_rate')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Available for Hire</label>
                <input
                  type="checkbox"
                  {...register('available_for_hire')}
                  className="mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">GitHub</label>
                <input
                  type="url"
                  {...register('github')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                  type="url"
                  {...register('linkedin')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Twitter</label>
                <input
                  type="url"
                  {...register('twitter')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Personal Website</label>
                <input
                  type="url"
                  {...register('website')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;