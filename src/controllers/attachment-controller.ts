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
    // const errors = validationResult(req);
    //
    // if (!errors.isEmpty()) {
    //   return next(new HttpError(ERROR_MESSAGES.INVALID_INPUT_DATA, 422));
    // }
    console.log(req.body);
    try {
      const createdAttachment = (new Attachments({ name: req.body.name, url: req?.file?.path })).save();

      res.status(201).json({ attachment: createdAttachment });
    } catch (e) {
      console.log({ e });
      return next(new HttpError(ERROR_MESSAGES.GENERIC));
    }
  }
;

export const deleteAttachment = async (req: any, res: any, next: NextFunction) => {
  // TODO -> we need to locate the file and delete it from the filesystem. perhaps matching names will help.
  try {
    await Attachments.delete(req.params?.attachmentId || '');

    res.status(200).json({ successMessage: MESSAGES.DELETED_SUCCESSFULLY });
  } catch (e) {
    return next(new HttpError(ERROR_MESSAGES.GENERIC));
  }
};
