// components/CommentsSection.jsx
import React, { useState, useEffect } from 'react';
import { getComments, createComment, createReply } from '../api';

const CommentsSection = ({ ideaId }) => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const data = await getComments(ideaId);
      setComments(data);
    } catch (error) {
      console.error('Ошибка при загрузке комментариев:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;
    setLoading(true);
    try {
      await createComment(ideaId, newCommentText);
      setNewCommentText('');
      fetchComments();
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (commentUID) => {
    if (!replyText[commentUID]?.trim()) return;
    try {
      await createReply({ commentUID, replyText: replyText[commentUID] });
      setReplyText(prev => ({ ...prev, [commentUID]: '' }));
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error('Ошибка при ответе:', error);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">Комментарии</h3>
      {comments.length === 0 ? (
        <p className="text-gray-500">Нет комментариев</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.commentUID} className="bg-gray-50 p-2 rounded mb-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <img
                  src={comment.authorID?.avatar || 'https://via.placeholder.com/32'}
                  className="w-8 h-8 rounded-full"
                  alt={comment.authorID?.name || 'Автор'}
                />
                <span className="font-medium">{comment.authorID?.name || 'Автор'}</span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(comment.timestamp).toLocaleString('ru-RU')}
              </span>
            </div>
            <p className="mb-2">{comment.commentText}</p>
            {/* Кнопка "Ответить" */}
            <button
              className="text-blue-500 text-sm"
              onClick={() => setReplyingTo(comment.commentUID)}
            >
              Ответить
            </button>
            {/* Поле для ответа */}
            {replyingTo === comment.commentUID && (
              <div className="mt-2">
                <textarea
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Ваш ответ"
                  value={replyText[comment.commentUID] || ''}
                  onChange={(e) =>
                    setReplyText((prev) => ({ ...prev, [comment.commentUID]: e.target.value }))
                  }
                />
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => handleReply(comment.commentUID)}
                >
                  Отправить ответ
                </button>
                <button
                  className="ml-2 px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setReplyingTo(null)}
                >
                  Отмена
                </button>
              </div>
            )}
            {/* Здесь можно отображать ответы, если есть */}
            {/* например, комментарии-ответы внутри комментария */}
          </div>
        ))
      )}

      {/* Форма добавления комментария */}
      <div className="mt-4 flex space-x-2">
        <textarea
          className="flex-1 p-2 border rounded"
          placeholder="Ваш комментарий"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleAddComment}
          disabled={loading}
        >
          {loading ? 'Отправка...' : 'Отправить'}
        </button>
      </div>
    </div>
  );
};

export default CommentsSection;