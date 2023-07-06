const multer = require("multer");
const path = require("path");

// Destination to store video
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/videos/`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 800 * 1024 * 1024, // 800MB in bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(mp4|mov|avi|mkv)$/)) {
      // upload only mp4, mov, avi, or mkv format
      return cb(
        new Error(
          "Por favor, envie apenas vídeos no formato mp4, mov, avi ou mkv!"
        )
      );
    }
    cb(undefined, true);
  },
});

module.exports = { videoUpload };
