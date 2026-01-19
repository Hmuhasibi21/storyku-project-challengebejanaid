import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StoryList from './pages/StoryList';
import AddStory from './pages/AddStory';
import AddChapter from './pages/AddChapter';
import EditStory from './pages/EditStory';
import Dashboard from './pages/Dashboard';
import StoryDetail from './pages/StoryDetail';
import Preloader from './components/Preloader';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { setIsLoading(false); }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Preloader />;

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<StoryList />} />
        <Route path="/add-story" element={<AddStory />} />
        <Route path="/add-chapter" element={<AddChapter />} />
        <Route path="/edit-story/:id" element={<EditStory />} />
        <Route path="/story-detail/:id" element={<StoryDetail />} />
      </Routes>
    </Router>
  );
}

export default App;