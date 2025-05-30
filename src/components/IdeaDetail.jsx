import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getIdeaByUID, getUserByUID, getCategories, getStatuses, createComment as apiCreateComment, createReply as apiCreateReply } from '../api';

// Helper Avatar Component
const Avatar = ({ user, size = "w-10 h-10" }) => {
  if (user?.PfpURL) {
    return <img src={user.PfpURL} alt={user.Name || 'avatar'} className={`${size} rounded-full object-cover`} />;
  }
  const initials = `${user?.Name?.[0] || ''}${user?.Surname?.[0] || ''}`.toUpperCase() || 'U';
  const bgColor = "bg-orange-500";

  return (
      <div className={`${size} rounded-full ${bgColor} flex items-center justify-center text-white font-semibold text-xs`}>
        {initials}
      </div>
  );
};

// Helper Date Formatter
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
  } catch (e) {
    console.warn("Error formatting date:", dateString, e);
    return dateString;
  }
};

const IdeaDetail = () => {
  const { id } = useParams(); // This 'id' is the IdeaUID

  const [ideaDetails, setIdeaDetails] = useState(null);
  const [ideaAuthorDetails, setIdeaAuthorDetails] = useState(null);
  const [comments, setComments] = useState([]); // Will now store comments with their replies
  const [commentAuthorsMap, setCommentAuthorsMap] = useState({});

  const [categoriesMap, setCategoriesMap] = useState({});
  const [statusesMap, setStatusesMap] = useState({});

  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // State for handling replies
  const [replyingToCommentUID, setReplyingToCommentUID] = useState(null); // UID of comment being replied to
  const [currentReplyText, setCurrentReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [submitReplyError, setSubmitReplyError] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchIdeaData = async (isMounted = true) => {
    if (!isMounted) return;
    setLoading(true);
    setError(null);
    setSubmitError(null);
    setSubmitReplyError(null); // Reset reply error on fetch

    try {
      const ideaResponse = await getIdeaByUID(id);
      if (!isMounted) return;
      if (!ideaResponse || !ideaResponse.Idea) {
        throw new Error('Идея не найдена или неверный формат ответа');
      }
      setIdeaDetails(ideaResponse.Idea);

      const [categoriesList, statusesList] = await Promise.all([
        getCategories().catch(e => { console.error("Failed to fetch categories", e); return []; }),
        getStatuses().catch(e => { console.error("Failed to fetch statuses", e); return []; })
      ]);
      if (!isMounted) return;

      setCategoriesMap(
          (categoriesList || []).reduce((acc, cat) => {
            acc[cat.CategoryID] = cat.CategoryName;
            return acc;
          }, {})
      );
      setStatusesMap(
          (statusesList || []).reduce((acc, stat) => {
            acc[stat.StatusID] = stat.StatusName;
            return acc;
          }, {})
      );

      if (ideaResponse.Idea.Author) {
        const authorData = await getUserByUID(ideaResponse.Idea.Author).catch(e => {
          console.error("Failed to fetch idea author", e);
          return { Name: "Неизвестный", Surname: "Автор", PfpURL: null, Uid: ideaResponse.Idea.Author };
        });
        if (!isMounted) return;
        setIdeaAuthorDetails(authorData);
      }

      // Process comments and their replies
      const processedComments = (ideaResponse.CommentReplies || []).map(cr => {
        if (!cr || !cr.Comment || !cr.Comment.CommentUID) return null;
        return {
          ...cr.Comment,
          Replies: cr.Replies || [] // Attach replies array to the comment object
        };
      }).filter(Boolean); // Remove any nulls if cr.Comment was invalid

      setComments(processedComments);

      if (processedComments.length > 0) {
        const authorIDSet = new Set();
        processedComments.forEach(comment => {
          if (comment.AuthorID) authorIDSet.add(comment.AuthorID);
          (comment.Replies || []).forEach(reply => {
            if (reply.AuthorID) authorIDSet.add(reply.AuthorID); // 'authorID' from reply structure
          });
        });

        const uniqueAuthorIDs = Array.from(authorIDSet);

        if (uniqueAuthorIDs.length > 0) {
          const authorPromises = uniqueAuthorIDs.map(AuthorID =>
              getUserByUID(AuthorID).catch(e => {
                console.warn(`Failed to fetch author ${AuthorID}:`, e);
                // Ensure Uid is present for map key
                return { Uid: AuthorID, Name: 'Неизвестный', Surname: 'Автор', PfpURL: null };
              })
          );
          const authors = await Promise.all(authorPromises);
          if (!isMounted) return;
          setCommentAuthorsMap(authors.reduce((acc, author) => {
            if (author) acc[author.UID] = author;
            return acc;
          }, {}));
        } else {
          if (!isMounted) return;
          setCommentAuthorsMap({});
        }
      } else {
        if (!isMounted) return;
        setCommentAuthorsMap({});
      }
    } catch (err) {
      console.error("Error fetching idea details:", err);
      if (isMounted) setError(err.message || 'Не удалось загрузить детали идеи.');
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (id) {
      fetchIdeaData(isMounted);
    }
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePostComment = async () => {
    if (!newCommentText.trim()) return;
    setIsSubmittingComment(true);
    setSubmitError(null);
    try {
      await apiCreateComment(id, newCommentText);
      setNewCommentText('');
      await fetchIdeaData(true); // Pass true for isMounted consistency
    } catch (err) {
      console.error("Failed to post comment:", err);
      setSubmitError("Не удалось отправить комментарий. Попробуйте еще раз.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handlePostReply = async (parentCommentUID) => {
    if (!currentReplyText.trim()) return;
    setIsSubmittingReply(true);
    setSubmitReplyError(null);
    try {
      await apiCreateReply(parentCommentUID, currentReplyText);
      setCurrentReplyText('');
      setReplyingToCommentUID(null);
      await fetchIdeaData(true);
    } catch (err) {
      console.error("Failed to post reply:", err);
      setSubmitReplyError("Не удалось отправить ответ. Попробуйте еще раз.");
    } finally {
      setIsSubmittingReply(false);
    }
  };


  if (loading) return <div className="flex justify-center items-center h-[calc(100vh-4rem)] text-xl">Загрузка...</div>;
  if (error) return <div className="p-6 m-auto mt-10 max-w-lg text-center text-red-700 bg-red-100 border border-red-400 rounded-lg shadow">{error}</div>;
  if (!ideaDetails) return <div className="p-6 m-auto mt-10 max-w-lg text-center text-gray-600 bg-gray-100 border border-gray-300 rounded-lg shadow">Идея не найдена.</div>;

  const categoryNamesMap = {
    0: 'Срочно',
    1: 'Бюджет',
    2: 'Развитие',
    3: 'Дизайн/Брендинг',
    4: 'Эксперимент',
    5: 'Маркетинг',
    6: 'Производство',
  };

  const currentCategoryName = categoryNamesMap[ideaDetails.CategoryID] ?? 'Не определена';
  const statusNamesMap = {
    0: 'Нейтральная',
    1: 'Одобренная',
    2: 'Отклоненная',
  };

  const currentStatusName = statusNamesMap[ideaDetails.StatusID] ?? 'Не определен';

  const authorFullName = ideaAuthorDetails ? `${ideaAuthorDetails.Name || ''} ${ideaAuthorDetails.Surname || ''}`.trim() : 'Неизвестный автор';

  return (
      <div className="bg-[#EAEAF4] min-h-[calc(100vh-4rem)] font-sans">
        <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            {/* Left Column */}
            <div className="lg:w-2/3 space-y-6">
              {/* Idea Content */}
              <div className="bg-white shadow-lg rounded-xl p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{ideaDetails.Name}</h1>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap prose max-w-none">
                  {ideaDetails.Text}
                </div>
              </div>

              {/* Leave Comment */}
              <div className="bg-white shadow-lg rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Оставить комментарий</h2>
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    rows="4"
                    placeholder="Введите ваш комментарий..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    disabled={isSubmittingComment}
                />
                {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}
                <button
                    onClick={handlePostComment}
                    disabled={isSubmittingComment || !newCommentText.trim()}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 transition duration-150"
                >
                  {isSubmittingComment ? 'Отправка...' : 'Отправить комментарий'}
                </button>
              </div>

              {/* Comments List */}
              <div className="bg-white shadow-lg rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Комментарии</h2>
                {comments.length > 0 ? (
                    <ul className="space-y-6">
                      {comments.map((comment) => {
                        const author = commentAuthorsMap[comment.AuthorID] || { Name: 'Неизвестный', Surname: 'Автор', PfpURL: null };
                        const commentAuthorFullName = `${author.Name || ''} ${author.Surname || ''}`.trim() || 'Аноним';
                        return (
                            <li key={comment.CommentUID} className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
                              <div className="flex items-start space-x-3">
                                <Avatar user={author} />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-gray-900">{commentAuthorFullName}</p>
                                    <p className="text-xs text-gray-500">{formatDate(comment.Timestamp)}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{comment.CommentText}</p>
                                  <button
                                      onClick={() => {
                                        if (replyingToCommentUID === comment.CommentUID) {
                                          setReplyingToCommentUID(null);
                                          setCurrentReplyText('');
                                          setSubmitReplyError(null);
                                        } else {
                                          setReplyingToCommentUID(comment.CommentUID);
                                          setCurrentReplyText('');
                                          setSubmitReplyError(null);
                                        }
                                      }}
                                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    {replyingToCommentUID === comment.CommentUID ? 'Отменить' : 'Ответить'}
                                  </button>

                                  {/* Reply Input Form */}
                                  {replyingToCommentUID === comment.CommentUID && (
                                      <div className="mt-3 ml-10 pl-3 border-l-2 border-gray-200">
                                      <textarea
                                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                          rows="3"
                                          placeholder="Напишите ваш ответ..."
                                          value={currentReplyText}
                                          onChange={(e) => setCurrentReplyText(e.target.value)}
                                          disabled={isSubmittingReply}
                                      />
                                        {submitReplyError && <p className="text-red-500 text-xs mt-1">{submitReplyError}</p>}
                                        <div className="mt-2 flex items-center space-x-2">
                                          <button
                                              onClick={() => handlePostReply(comment.CommentUID)}
                                              disabled={isSubmittingReply || !currentReplyText.trim()}
                                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium disabled:opacity-60"
                                          >
                                            {isSubmittingReply ? 'Отправка...' : 'Отправить ответ'}
                                          </button>
                                          <button
                                              onClick={() => {
                                                setReplyingToCommentUID(null);
                                                setCurrentReplyText('');
                                                setSubmitReplyError(null);
                                              }}
                                              disabled={isSubmittingReply}
                                              className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md text-xs font-medium border border-gray-300 hover:bg-gray-100"
                                          >
                                            Отмена
                                          </button>
                                        </div>
                                      </div>
                                  )}

                                  {/* Display existing replies */}
                                  {comment.Replies && comment.Replies.length > 0 && (
                                      <ul className="mt-4 ml-10 space-y-4 pl-3 border-l-2 border-gray-200">
                                        {comment.Replies.map(reply => {
                                          console.log(reply)
                                          const replyAuthor = commentAuthorsMap[reply.AuthorID] || { Name: 'Неизвестный', Surname: 'Автор', PfpURL: null };
                                          const replyAuthorFullName = `${replyAuthor.Name || ''} ${replyAuthor.Surname || ''}`.trim() || 'Аноним';
                                          return (
                                              <li key={reply.replyUID} className="flex items-start space-x-2.5">
                                                <Avatar user={replyAuthor} size="w-8 h-8" />
                                                <div className="flex-1">
                                                  <div className="flex items-baseline justify-between">
                                                    <p className="text-xs font-semibold text-gray-800">{replyAuthorFullName}</p>
                                                    <p className="text-xs text-gray-500">{formatDate(reply.Timestamp)}</p>
                                                  </div>
                                                  <p className="mt-0.5 text-xs text-gray-700 whitespace-pre-wrap">{reply.ReplyText}</p>
                                                </div>
                                              </li>
                                          );
                                        })}
                                      </ul>
                                  )}
                                </div>
                              </div>
                            </li>
                        );
                      })}
                    </ul>
                ) : (
                    <p className="text-gray-500">Комментариев пока нет.</p>
                )}
              </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="lg:w-1/3 mt-6 lg:mt-0">
              <div className="bg-white shadow-lg rounded-xl p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-5">Информация об идее</h2>
                <div className="space-y-3 text-sm">
                  <p><strong className="font-semibold text-gray-600">Автор:</strong> <span
                      className="text-gray-800">{authorFullName}</span></p>
                  <p><strong className="font-semibold text-gray-600">Дата создания:</strong> <span
                      className="text-gray-800">{formatDate(ideaDetails.CreationDate).split(',')[0]}</span></p>
                  <p><strong className="font-semibold text-gray-600">Статус идеи:</strong> <span
                      className="text-gray-800">{currentStatusName}</span></p>

                  <div className="flex items-center pt-1">
                  <span className="flex items-center mr-4 text-green-600">
                    <img src="/like.svg" alt="Like" className="h-5 w-5 mr-1"/>
                    {ideaDetails.LikeCount}
                  </span>
                    <span className="flex items-center text-red-600">
                    <img src="/dislike.svg" alt="Dislike" className="h-5 w-5 mr-1"/>
                      {ideaDetails.DislikeCount}
                  </span>
                  </div>

                  <div className="pt-2">
                    <strong className="font-semibold text-gray-600 block mb-2">Категория:</strong>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                        {currentCategoryName}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

export default IdeaDetail;