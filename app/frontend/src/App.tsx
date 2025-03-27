import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import ProfileScreen from './components/ProfileScreen';
import MainScreen from './screens/MainScreen';
import PostTask from './screens/PostTask';
import LoginScreen from './screens/LoginScreen';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<MainScreen />} /> {/* Главный экран */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/post-task" element={<PostTask />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;