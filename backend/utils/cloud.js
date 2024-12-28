const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');


// Загружаем переменные окружения
dotenv.config();

// Конфигурация Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // ponyat `to za polya
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Функция загрузки файла
const uploadFile = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'assignments', // Папка в Cloudinary
    });
    return result.url; // Ссылка на загруженный файл
  } catch (error) {
    throw new Error('Error sending file: ' + error.message);
  }
};



module.exports = { uploadFile };
