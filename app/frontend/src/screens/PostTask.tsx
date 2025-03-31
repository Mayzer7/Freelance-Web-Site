import React, { useState, useEffect } from 'react';
import { Code2, Plus, Search, User } from 'lucide-react';
import { Link } from "react-router-dom";
import { TaskModal, TaskFormData } from '../components/TaskModal';
import { createTask, getTasks } from '../api/tasks';

interface FreelancerCard {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  rating: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  budget: number;
  skills: string[];
  created_at: string;
  author: {
    username: string;
    avatar: string | null;
  };
}

const freelancers: FreelancerCard[] = [
  {
    id: '1',
    name: 'Анна Смирнова',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    skills: ['UI/UX Design', 'Web Development'],
    rating: 4.8
  },
  {
    id: '2',
    name: 'Михаил Петров',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    skills: ['Mobile Development', 'React Native'],
    rating: 4.9
  },
  {
    id: '3',
    name: 'Елена Козлова',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    skills: ['Graphic Design', 'Branding'],
    rating: 4.7
  }
];

function PostTask() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const handleCreateTask = async (taskData: TaskFormData) => {
    try {
      await createTask(taskData);
      await loadTasks(); // Reload tasks after creating new one
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="w-8 h-8 text-blue-400" />
            <Link to="/">
              <span className="text-xl font-bold">FreelanceHub</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Новое задание
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Illustration */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Найдите лучших
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"> фрилансеров</span>
              {' '}для вашего проекта
            </h1>
            <p className="text-gray-300 text-lg">
              Разместите задание и получите предложения от профессиональных исполнителей уже сегодня.
            </p>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"></div>
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=80"
              alt="Freelancer workspace"
              className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="container mx-auto px-6 py-8">
        <div className="bg-slate-800/50 p-6 rounded-xl">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Поиск заданий..."
                className="w-full pl-12 pr-4 py-3 bg-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="bg-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Все категории</option>
              <option value="design">Дизайн</option>
              <option value="development">Разработка</option>
              <option value="marketing">Маркетинг</option>
            </select>
          </div>
        </div>
      </section>

      {/* Tasks Section */}
      <section className="container mx-auto px-6 py-8">
        {tasks.map((task) => (
          <div key={task.id} className="bg-slate-800/50 p-6 rounded-xl mb-8">
            <div className="flex items-center mb-4">
              {task.author.avatar ? (
                <img 
                  src={`http://localhost:8000${task.author.avatar}`}  
                  alt={task.author.username} 
                  className="w-10 h-10 rounded-full mr-4" 
                />
              ) : (
                <div className="w-10 h-10 bg-gray-600 rounded-full mr-4 flex items-center justify-center text-white">
                  {task.author.username[0].toUpperCase()}
                </div>
              )}
              <span className="font-semibold">{task.author.username}</span>
            </div>
            <h2 className="text-2xl font-bold mb-6">{task.title}</h2>
            <p className="text-gray-300 mb-6">{task.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {task.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
              <span className="text-gray-400">Бюджет: {task.budget} ₽</span>
            </div>
          </div>
        ))}

        <h3 className="text-xl font-semibold mb-6">Рекомендуемые исполнители</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <div key={freelancer.id} className="bg-slate-800/50 rounded-xl p-6 hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={freelancer.avatar}
                  alt={freelancer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{freelancer.name}</h4>
                  <div className="flex items-center text-yellow-400">
                    <span className="text-sm">★ {freelancer.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors flex items-center justify-center">
                <User className="w-4 h-4 mr-2" />
                Просмотреть профиль
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PostTask;