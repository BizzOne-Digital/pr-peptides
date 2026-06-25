const multer = require('multer');

// Memory storage — file buffer directly Cloudinary ko jayegi
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  if (allowed.test(file.mimetype)) cb(null, true);
  else cb(new Error('Only images allowed (jpeg, jpg, png, webp)'));
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });