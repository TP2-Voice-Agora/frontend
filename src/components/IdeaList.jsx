import React from 'react';
import IdeaCard from './IdeaCard';

const IdeaList = ({ ideas, handleVote }) => {
  return (
    <div className="my-6">
      {ideas.map(idea => (
        <IdeaCard key={idea.id} idea={idea} handleVote={handleVote} />
      ))}
    </div>
  );
};

export default IdeaList;