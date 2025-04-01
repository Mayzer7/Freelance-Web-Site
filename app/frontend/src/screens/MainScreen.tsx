import React, { useState } from "react";
import {
  Code2,
  Briefcase,
  Users,
  Star,
  ArrowRight,
  Search,
  Menu,
  X,
  UserCircle
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

function MainScreen() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверяем аутентификацию при загрузке компонента
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/login/', {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const AuthButton = () => {

    const token = localStorage.getItem("token")

    return (
      <button
        className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full transition-colors"
        onClick={() => navigate(token ? "/profile" : "/login")}
      >
        {token ? "Перейти в профиль" : "Войти"}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="w-8 h-8 text-blue-400" />
            <Link to="/" className="text-xl font-bold hover:text-blue-400 transition-colors">
              FreelanceHub
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="hover:text-blue-400 transition-colors">
              Найти работу
            </a>
            <Link to="/post-task" className="hover:text-blue-400 transition-colors">
              Разместить задание
            </Link>
            <a href="#" className="hover:text-blue-400 transition-colors">
              FAQ
            </a>
            <AuthButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-slate-800 shadow-lg transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="flex flex-col space-y-4 p-6">
            <a href="#" className="hover:text-blue-400 transition-colors">
              Найти работу
            </a>
            <Link to="/post-task" className="hover:text-blue-400 transition-colors">
              Разместить задание
            </Link>
            <a href="#" className="hover:text-blue-400 transition-colors">
              FAQ
            </a>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Connect with Top
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {" "}
                Freelance Talent
              </span>
            </h1>
            <p className="text-gray-300 text-lg">
              Найдите отличных фрилансеров для своих проектов или
              продемонстрируйте свои навыки клиентам по всему миру.
              Присоединяйтесь к нашему растущему сообществу профессионалов.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 gradient-hover px-8 py-3 rounded-full font-semibold flex items-center justify-center space-x-2">
                Get Started <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border border-gray-500 hover:border-blue-400 px-8 py-3 rounded-full font-semibold transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative animate-float hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"></div>
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
              alt="Freelancer working"
              className="rounded-2xl shadow-2xl relative"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 p-8 rounded-2xl hover:bg-gradient-to-r from-blue-500/10 to-purple-500/10 transition-all duration-300">
            <Briefcase className="w-12 h-12 text-blue-400 mb-6" />
            <h3 className="text-xl font-semibold mb-4">
              Находите Идеальные Проекты
            </h3>
            <p className="text-gray-400">
              Получите доступ к широкому спектру проектов, соответствующих вашим навыкам и опыту.
            </p>
          </div>
          <div className="bg-slate-800/50 p-8 rounded-2xl hover:bg-gradient-to-r from-blue-500/10 to-purple-500/10 transition-all duration-300">
            <Users className="w-12 h-12 text-purple-400 mb-6" />
            <h3 className="text-xl font-semibold mb-4">Лучшие OG Работники</h3>
            <p className="text-gray-400">
              Общайтесь с квалифицированными профессионалами со всего мира.
            </p>
          </div>
          <div className="bg-slate-800/50 p-8 rounded-2xl hover:bg-gradient-to-r from-blue-500/10 to-purple-500/10 transition-all duration-300">
            <Star className="w-12 h-12 text-yellow-400 mb-6" />
            <h3 className="text-xl font-semibold mb-4">Безопасные платежи</h3>
            <p className="text-gray-400">
              Гарантированные выплаты и профессиональная система выполнения работ.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 md:p-12 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/50"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Готовы приступить к работе?
            </h2>
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row bg-white rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Ищите навыки или проекты..."
                className="w-full px-6 py-4 text-gray-900 outline-none"
              />
              <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainScreen;