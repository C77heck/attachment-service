import express from 'express';
import { check } from 'express-validator';
import { createAttachment, deleteAttachment, getAttachmentById } from '../controllers/attachment-controller';
import { fileUpload } from '../middlewares/file.uploader';

const router = express.Router();

router.get('/get-by-id/:attachmentId', [], getAttachmentById);

router.post('/create', fileUpload.single('image'), [check('name').escape().trim()], createAttachment);

router.delete('/delete/:reviewId', [], deleteAttachment);

export default router;
