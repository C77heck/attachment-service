const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// TODO -> we need the rest of the mime types
const MIME_TYPE_MAP: any = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/tiff': 'tiff',
  'image/webp': 'webp'
};

interface UploadedFile extends File {
  mimetype: string;
}

export const fileUpload = multer({
  limits: process.env.FILE_UPLOAD_LIMIT,
  /* this is the set max size in bytes */
  storage: multer.diskStorage({
    destination: (req: any, file: UploadedFile, callBack: Function) => {
      callBack(null, 'uploads/images');
    },
    filename: (req: any, file: UploadedFile, callBack: Function) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      //we extract the right extension with mimetype to recognize and use it
      callBack(null, uuidv4() + '.' + ext);
      /* file name generator */
    }
  }),
  fileFilter: (req: any, file: UploadedFile, callBack: Function) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];

    let error = isValid ? null : new Error('Invalid mime type!');
    callBack(error, isValid);
  }
});
