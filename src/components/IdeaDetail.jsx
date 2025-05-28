import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { getIdeaById, getComments, createComment, voteForIdea } from '../api';
import { useAuth } from '../context/AuthContext';

const IdeaDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ideaData, commentsData] = await Promise.all([
          getIdeaById(id),
          getComments(id)
        ]);
        setIdea(ideaData);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load idea details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      setError('Please login to vote');
      return;
    }

    try {
      const updatedIdea = await voteForIdea(id, voteType);
      setIdea(updatedIdea);
    } catch (error) {
      console.error('Error voting:', error);
      setError('Failed to submit vote');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please login to comment');
      return;
    }

    try {
      const newCommentData = await createComment({ ideaId: id, text: newComment });
      setComments([...comments, newCommentData]);
      setNewComment('');
      setError(null);
    } catch (error) {
      console.error('Error creating comment:', error);
      setError('Failed to submit comment');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!idea) {
    return <div className="text-center py-8">Идея не найдена</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
      {/* Main content */}
      <div className="flex-grow max-w-4xl">
        <div className="bg-white rounded-lg p-8 mb-6">
          <h1 className="text-2xl font-bold mb-6">IDEA {idea.id}:</h1>
          
          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 whitespace-pre-wrap">
              {idea.description}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => handleVote('up')}
              className="vote-button text-green-500"
            >
              <FaThumbsUp /> <span>{idea.upVotes}</span>
            </button>
            <button 
              onClick={() => handleVote('down')}
              className="vote-button text-red-500"
            >
              <FaThumbsDown /> <span>{idea.downVotes}</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-6">Комментарии</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-lg mb-4"
                rows="4"
                placeholder="Введите ваш комментарий..."
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Отправить
              </button>
            </form>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg mb-6">
              <p className="text-gray-600 mb-4">Войдите в аккаунт, чтобы оставить комментарий</p>
              <button
                onClick={() => setShowLoginForm(true)}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Войти
              </button>
            </div>
          )}

          <div className="space-y-6 mt-8">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={comment.author.avatar || "https://via.placeholder.com/32"} 
                      className="w-8 h-8 rounded-full" 
                      alt={comment.author.name} 
                    />
                    <span className="font-medium">{comment.author.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString('ru-RU')}
                  </span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
                {isAuthenticated && (
                  <button className="text-blue-500 text-sm mt-2">Ответить</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-white rounded-lg p-6 sticky top-6">
          <h2 className="text-xl font-bold mb-6">Информация об идее</h2>
          
          <div className="space-y-4">
            <div>
              <span className="text-gray-500">Автор:</span>
              <span className="ml-2">{idea.author?.name || 'No name'}</span>
            </div>
            <div>
              <span className="text-gray-500">Дата создания:</span>
              <span className="ml-2">{new Date(idea.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>
            <div>
              <span className="text-gray-500">Статус идеи:</span>
              <span className="ml-2">{idea.status}</span>
            </div>
            
            <div>
              <h3 className="text-gray-500 mb-2">Категории:</h3>
              <div className="flex flex-wrap gap-2">
                {(idea.categories || []).map(category => (
                  <span 
                    key={category} 
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail;