import React, { useState }from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfileScreen from './components/ProfileScreen';
import PublicProfileScreen from './components/PublicProfileScreen';
import MainScreen from './screens/MainScreen';
import PostTask from './screens/PostTask';
import LoginScreen from './screens/LoginScreen';

import { Messenger, MessengerButton } from './components/Messanger';

function App() {
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);

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

        {/* Messenger Components */}
        <MessengerButton onClick={() => setIsMessengerOpen(true)} />
        <Messenger 
          isOpen={isMessengerOpen} 
          onClose={() => setIsMessengerOpen(false)} 
        />
      </div>
    </Router>
  );
}

export default App;