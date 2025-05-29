// components/ProfilePictureUploader.jsx
import React, { useState } from 'react';
import { uploadProfilePicture } from '../api';

const ProfilePictureUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const data = await uploadProfilePicture(file);
      setUploadedUrl(data.url || data); // зависит от API
    } catch (err) {
      setError('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <h3 className="text-xl mb-4">Загрузка аватара</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? 'Загружается...' : 'Загрузить'}
      </button>
      {error && <div className="mt-2 text-red-500">{error}</div>}
      {uploadedUrl && (
        <div className="mt-4">
          <p>Аватар успешно загружен:</p>
          <img src={uploadedUrl} alt="Аватар" className="w-24 h-24 object-cover rounded-full" />
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUploader;