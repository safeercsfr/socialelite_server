import multer from 'multer';

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname + Date.now());
  },
});

export const upload = multer({ storage });
