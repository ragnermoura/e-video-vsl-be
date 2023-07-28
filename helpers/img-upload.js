const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const s3Client = require("./awsS3");

// Destination to store image
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, `public/thumbs`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'evideovsl',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now() + '-' +(file.originalname)); // O caminho (key) do objeto no S3
    }
  }),
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|webp)$/)) {
      // upload only png and jpg format
      return cb(new Error("Por favor, envie apenas png ou jpg!"));
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload };
