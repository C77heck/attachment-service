import multer, { FileFilterCallback } from 'multer';
import { v4 } from 'uuid';
import { ERROR_MESSAGES } from '../libs/constants';

// TODO -> we need the rest of the mime types
const MIME_TYPE_MAP: any = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/tiff': 'tiff',
  'image/webp': 'webp'
};

const storage = multer.diskStorage({
  destination: ((req: Express.Request, file: Express.Multer.File, callBack: Function) => {
    callBack(null, 'uploads/files');
  }),
  filename: ((req: Express.Request, file: Express.Multer.File, callBack: Function) => {
    const extension = MIME_TYPE_MAP[file.mimetype];

    callBack(null, `${v4()}.${extension}`);
  })
});
const fileFilter = ((req: Express.Request, file: Express.Multer.File, callBack: FileFilterCallback) => {
  const isValid = !!MIME_TYPE_MAP[file.mimetype];
  if (isValid) {
    callBack(null, isValid);
  }

  callBack(new Error(ERROR_MESSAGES.INVALID_MIME));
});

const limits = { fileSize: 500000 };

export const fileUpload = multer({ storage, limits, fileFilter });
