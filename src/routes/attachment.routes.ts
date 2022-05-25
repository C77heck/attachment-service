import express from 'express';
import { body, check } from 'express-validator';
import { createAttachment, deleteAttachment, getAttachmentById } from '../controllers/attachment-controller';

const router = express.Router();

router.get('/get-by-id/:attachmentId', [], getAttachmentById);

router.post('/create', [
  body('*').trim().escape(),
  check('name').escape().trim()
], createAttachment);

router.delete('/delete/:reviewId', [], deleteAttachment);

export default router;
