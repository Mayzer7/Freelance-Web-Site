import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

interface RegistrationData {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

const RegistrationForm = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<RegistrationData>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegistrationData) => {
    try {
      const response = await axios.post('/api/users/register/', data, {
        withCredentials: true
      });
      console.log('Registration successful:', response.data);
      
      // Set CSRF token for future requests
      axios.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
      axios.defaults.withCredentials = true;
      
      navigate('/profile'); // Redirect to profile page after successful registration
    } catch (error: any) {
      if (error.response?.data) {
        // Handle form errors from the backend
        Object.keys(error.response.data).forEach((key) => {
          setError(key as keyof RegistrationData, {
            type: 'manual',
            message: error.response.data[key][0]
          });
        });
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-8">
        <UserPlus className="h-8 w-8 text-indigo-600" />
        <h2 className="text-2xl font-bold ml-2 text-gray-900">Register</h2>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            {...register('username', { required: 'Username is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password1" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register('password1', { required: 'Password is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.password1 && (
            <p className="mt-1 text-sm text-red-600">{errors.password1.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            {...register('password2', { required: 'Please confirm your password' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.password2 && (
            <p className="mt-1 text-sm text-red-600">{errors.password2.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;