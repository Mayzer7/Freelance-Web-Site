import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfileScreen from './components/ProfileScreen';
import PublicProfileScreen from './components/PublicProfileScreen';
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
          <Route path="/profile/:username" element={<PublicProfileScreen />} />
          <Route path="/post-task" element={<PostTask />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;