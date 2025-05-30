import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserByUID, getIdeas, getPositions } from '../api'; // Убедитесь, что путь к api/index.js верный
import IdeaCard from '../components/IdeaCard'; // Убедитесь, что путь к IdeaCard.jsx верный

// Вспомогательная функция для генерации случайного цвета для аватарки-заглушки
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Вспомогательная функция для получения инициалов из имени и фамилии
const getInitials = (name, surname) => {
  if (!name || !surname) return '';
  return `${name[0]}${surname[0]}`.toUpperCase();
};

// Компонент аватарки-заглушки
const FallbackAvatar = ({ initials, size = 192 }) => {
  const [bgColor] = useState(() => getRandomColor()); // Инициализируем цвет один раз

  return (
      <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: bgColor,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${size / 3}px`, // Масштабируем размер шрифта относительно размера аватарки
            color: 'white',
            fontWeight: 'bold',
            lineHeight: 1, // Для лучшего вертикального выравнивания текста
          }}
          className="shadow-lg" // Добавляем тень, как у обычной аватарки
      >
        {initials}
      </div>
  );
};

const UserProfile = () => {
  const { uid } = useParams(); // uid пользователя, чей профиль просматривается
  const [user, setUser] = useState(null);
  const [userCreatedIdeas, setUserCreatedIdeas] = useState([]);
  const [positionName, setPositionName] = useState('');

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingExtraData, setLoadingExtraData] = useState(true); // Для должностей и идей

  const [error, setError] = useState(null);

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      setLoadingExtraData(true);
      setError(null);
      try {
        const userData = await getUserByUID(uid);
        // API должен возвращать объект пользователя с полями: Name, Surname, Patronymic (опционально), PfpURL, PositionID, Uid
        setUser(userData);
        console.log(localStorage.getItem('authToken'));
      } catch (err) {
        console.error('Ошибка загрузки данных пользователя:', err);
        setError('Не удалось загрузить данные пользователя.');
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    if (uid) {
      fetchUser();
    }
  }, [uid]);

  // Загрузка должностей и идей пользователя
  useEffect(() => {
    if (!user || !user.UID) {
      if (!loadingUser) setLoadingExtraData(false);
      return;
    }

    const fetchExtraData = async () => {
      setLoadingExtraData(true);
      try {
        const positionsData = await getPositions();
        const userPos = positionsData.find(p => p.id === user.PositionID);
        setPositionName(userPos ? userPos.name : 'Должность не указана');

        const allIdeas = await getIdeas();
        const ideas = Array.isArray(allIdeas) ? allIdeas : [];

        const filteredIdeas = ideas
            .filter(idea => idea.AuthorUID === user.Uid)
            .slice(0, 2);
        setUserCreatedIdeas(filteredIdeas);

      } catch (err) {
        console.error('Ошибка загрузки должностей или идей:', err);
        setError(prevError => prevError || 'Не удалось загрузить дополнительную информацию профиля.');
        setPositionName('Ошибка загрузки должности');
        setUserCreatedIdeas([]);
      } finally {
        setLoadingExtraData(false);
      }
    };


    fetchExtraData();
  }, [user, loadingUser]); // Перезапускаем, если изменился объект user или завершилась его загрузка


  if (loadingUser) return <div className="flex justify-center items-center h-screen text-lg">Загрузка профиля...</div>;
  if (error && !user) return <div className="text-center py-10 text-red-600 text-lg">{error}</div>;
  if (!user) return <div className="text-center py-10 text-gray-600 text-lg">Пользователь не найден.</div>;

  // Формирование полного имени пользователя
  const fullName = `${user.Surname || ''} ${user.Name || ''} ${user.Patronymic || ''}`.trim();

  return (
      <div className="min-h-screen bg-gray-50"> {/* Фон для всей страницы */}
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-x-8 gap-y-6">
            {/* Левая колонка: Аватар и информация о пользователе */}
            <div className="flex flex-col items-center md:items-start md:w-1/3 lg:w-1/4">
              <div className="w-48 h-48 mb-5"> {/* Размер контейнера аватарки 192x192px */}
                {user.PfpURL ? (
                    <img
                        src={user.PfpURL}
                        alt={`Аватар ${fullName}`}
                        className="w-full h-full rounded-full object-cover shadow-xl"
                    />
                ) : (
                    <FallbackAvatar
                        initials={getInitials(user.Name, user.Surname)}
                        size={192}
                    />
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-800 text-center md:text-left mb-1">
                {fullName}
              </h1>
              <p className="text-md text-gray-600 text-center md:text-left mb-4 min-h-[1.5em]"> {/* min-h для предотвращения "прыжка" текста при загрузке */}
                {loadingExtraData && !positionName ? 'Загрузка должности...' : (positionName || 'Должность не указана')}
              </p>
              <button
                  className="w-full md:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-md shadow-sm transition-colors"
                  // onClick={() => navigate(`/profile/${uid}/edit`)} // Для будущей функциональности редактирования
              >
                Изменить профиль
              </button>
            </div>

            {/* Правая колонка: Созданные идеи */}
            <div className="md:w-2/3 lg:w-3/4">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Созданные идеи</h2>
              {loadingExtraData ? (
                  <>
                    {/* Заглушки-скелетоны во время загрузки идей */}
                    <div className="bg-white rounded-lg p-6 mb-4 shadow-md h-[170px] animate-pulse border border-gray-200"></div>
                    <div className="bg-white rounded-lg p-6 mb-4 shadow-md h-[170px] animate-pulse border border-gray-200"></div>
                  </>
              ) : (
                  <>
                    {/* Слот для первой идеи */}
                    <div className="mb-4">
                      {userCreatedIdeas[0] ? (
                          <IdeaCard idea={userCreatedIdeas[0]} />
                      ) : (
                          <div
                              className="bg-white rounded-lg p-6 shadow-md border border-gray-200 flex items-center justify-center text-gray-400"
                              style={{ minHeight: '170px' }} // Примерная высота IdeaCard
                          >
                            Нет созданных идей
                          </div>
                      )}
                    </div>
                    {/* Слот для второй идеи */}
                    <div className="mb-4">
                      {userCreatedIdeas[1] ? (
                          <IdeaCard idea={userCreatedIdeas[1]} />
                      ) : (
                          <div
                              className="bg-white rounded-lg p-6 shadow-md border border-gray-200" // Пустой блок, как на макете
                              style={{ minHeight: '170px' }}
                          >
                            {/* Этот блок остается пустым, если нет второй идеи, согласно макету */}
                          </div>
                      )}
                    </div>
                  </>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserProfile;