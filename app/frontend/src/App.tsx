import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import ProfileScreen from './components/ProfileScreen';
import MainScreen from './screens/MainScreen';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<MainScreen />} /> {/* Главный экран */}
          <Route path="/login" element={
            <div className="flex items-center justify-center p-4">
              <div className="max-w-md w-full">
                <RegistrationForm />
              </div>
            </div>
          } />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;