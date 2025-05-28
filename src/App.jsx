import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import FilterTabs from './components/FilterTabs';
import SortControls from './components/SortControls';
import IdeaList from './components/IdeaList';
import CreateIdeaForm from './components/CreateIdeaForm';
import { ideas as initialIdeas } from './data/ideas';

function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [ideas, setIdeas] = useState(initialIdeas);
  const [sortBy, setSortBy] = useState('date');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleVote = (id, voteType) => {
    setIdeas(ideas.map(idea => {
      if (idea.id === id) {
        if (voteType === 'up') {
          return { ...idea, upVotes: idea.upVotes + 1 };
        } else {
          return { ...idea, downVotes: idea.downVotes + 1 };
        }
      }
      return idea;
    }));
  };

  const filterIdeas = () => {
    let filtered = [...ideas];

    if (activeTab === 'approved') {
      filtered = filtered.filter(idea => idea.status === 'approved');
    } else if (activeTab === 'rejected') {
      filtered = filtered.filter(idea => idea.status === 'rejected');
    } else if (activeTab === 'neutral') {
      filtered = filtered.filter(idea => idea.status === 'neutral');
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(idea => 
        idea.categories.some(cat => selectedCategories.includes(cat))
      );
    }

    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'popularity') {
      filtered.sort((a, b) => (b.upVotes - b.downVotes) - (a.upVotes - a.downVotes));
    }

    return filtered;
  };

  const MainContent = () => (
    <>
      <div className="my-5 flex justify-between items-center">
        <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <SortControls 
          sortBy={sortBy} 
          setSortBy={setSortBy}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </div>
      <IdeaList ideas={filterIdeas()} handleVote={handleVote} />
    </>
  );

  return (
    <Router>
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <Header />
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/create" element={<CreateIdeaForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;