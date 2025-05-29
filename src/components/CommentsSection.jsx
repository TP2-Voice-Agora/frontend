import React, { useState, useEffect } from 'react';
import { getComments, createComment, createReply } from '../api';

const CommentsSection = ({ ideaUID }) => {
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      const data = await getComments(ideaUID);
      setComments(data);
    } catch (err) {
      setError('Ошибка при загрузке комментариев');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ideaUID]);

  const handleAddComment = async () => {
    if (!replyText['new']?.trim()) return;
    setLoading(true);
    try {
      await createComment(ideaUID, replyText['new']);
      setReplyText(prev => ({ ...prev, 'new': '' }));
      fetchComments();
    } catch (err) {
      setError('Ошибка при добавлении комментария');
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
    } catch (err) {
      setError('Ошибка при ответе');
    }
  };

  return (
    <div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {comments.map((comment) => (
        <div key={comment.commentUID} className="border p-2 mb-2">
          {/* комментарий */}
          <div>{comment.commentText}</div>
          {/* ответы */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-4 border-l pl-2">
              {comment.replies.map((reply) => (
                <div key={reply.commentUID} className="mb-2">
                  <div className="text-sm text-gray-600">{reply.commentText}</div>
                </div>
              ))}
            </div>
          )}
          {/* форма ответа */}
          {replyingTo === comment.commentUID && (
            <div className="mt-2">
              <textarea
                className="w-full p-2 border rounded mb-2"
                placeholder="Ваш ответ"
                value={replyText[comment.commentUID] || ''}
                onChange={(e) =>
                  setReplyText(prev => ({ ...prev, [comment.commentUID]: e.target.value }))
                }
              />
              <button
                className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                onClick={() => handleReply(comment.commentUID)}
              >
                Отправить
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setReplyingTo(null)}
              >
                Отмена
              </button>
            </div>
          )}
          {/* кнопка "Ответить" */}
          <button
            className="text-blue-500 text-sm mt-2"
            onClick={() => setReplyingTo(comment.commentUID)}
          >
            Ответить
          </button>
        </div>
      ))}
      {/* форма добавления комментария */}
      <div className="mt-4 flex space-x-2">
        <textarea
          className="flex-1 p-2 border rounded"
          placeholder="Ваш комментарий"
          value={replyText['new'] || ''}
          onChange={(e) => setReplyText(prev => ({ ...prev, 'new': e.target.value }))}
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