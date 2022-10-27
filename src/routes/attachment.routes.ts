import express from 'express';
import { createFileAttachment, createImageAttachment, deleteAttachment, getFile } from '../controllers/attachment-controller';

const router = express.Router();

router.get('/:fileName', [], getFile);

router.post('/image-upload', [], createImageAttachment);

router.post('/file-upload', [], createFileAttachment);

router.delete('/delete/:fileName', [], deleteAttachment);

export default router;
