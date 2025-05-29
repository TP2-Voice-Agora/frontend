import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserByUID } from '../api';

const UserProfile = () => {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserByUID(uid);
        setUser(data);
      } catch (err) {
        setError('Не удалось загрузить данные пользователя');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [uid]);

  if (loading) return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!user) return <div className="text-center py-8">Пользователь не найден</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl mb-4">Профиль пользователя</h2>
      <div className="flex items-center mb-4">
        <img src={user.pfpURL} alt="Аватар" className="w-24 h-24 rounded-full object-cover mr-4" />
        <div>
          <p className="font-semibold">{user.name} {user.surname}</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <div>
        <p>Телефон: {user.phone}</p>
        <p>Дата найма: {user.hireDate}</p>
        <p>Последний онлайн: {user.lastOnline}</p>
        <p>Должность ID: {user.positionID}</p>
        <p>Роль: {user.isAdmin ? 'Админ' : 'Пользователь'}</p>
        {/* добавьте другие поля по необходимости */}
      </div>
    </div>
  );
};

export default UserProfile;