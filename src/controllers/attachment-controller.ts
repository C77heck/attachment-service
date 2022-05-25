// import { NextFunction } from 'express';

import { NextFunction } from 'express';
import { ERROR_MESSAGES, MESSAGES } from '../libs/constants';
import Attachments from '../models/attachment.model';
import { HttpError } from '../models/http.error';

export const getAttachmentById = async (req: any, res: any, next: NextFunction) => {
  try {
    const attachment = await Attachments.findById(req.params?.attachmentId || '');

    res.status(200).json({ attachment });
  } catch (e) {
    return next(new HttpError(ERROR_MESSAGES.GENERIC));
  }
};

export const createAttachment = async (req: any, res: any, next: NextFunction) => {
  try {
    const createdAttachment = (new Attachments({ ...req.body })).save();

    res.status(201).json({ attachment: createdAttachment });
  } catch (e) {
    return next(new HttpError(ERROR_MESSAGES.GENERIC));
  }
};

export const deleteAttachment = async (req: any, res: any, next: NextFunction) => {
  try {
    await Attachments.delete(req.params?.attachmentId || '');

    res.status(200).json({ successMessage: MESSAGES.DELETED_SUCCESSFULLY });
  } catch (e) {
    return next(new HttpError(ERROR_MESSAGES.GENERIC));
  }
};
