import express from 'express';
import multer from 'multer';
import { createAttachment, deleteAttachment, getAttachmentById } from '../controllers/attachment-controller';

const multerOptions = {
  limits: {
    fileSize: 2 * (1024 ** 2)
  }
};

const router = express.Router();

router.get('/get-by-id/:attachmentId', [], getAttachmentById);

router.post('/create', [], createAttachment);

router.delete('/delete/:reviewId', [], deleteAttachment);

export default router;
