import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { ERROR_MESSAGES, MESSAGES } from '../libs/constants';
import Attachments from '../models/attachment.model';
import { HttpError } from '../models/http.error';
import { FileInterface } from './interfaces/file.interface';
import { getFileExtension } from './libs/helpers';

export const getFile = async (req: express.Request, res: any, next: NextFunction) => {
  try {
    res.sendFile(`${path.resolve()}/attachments/files/${req.params.fileName}`);

  } catch (e) {
    return next(new HttpError(e as any));
  }
};

export const createAttachment = async (req: any, res: any, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError(ERROR_MESSAGES.INVALID_INPUT_DATA, 422));
  }

  try {
    const file: FileInterface = req.files?.file;
    const uploadName = file?.name;
    const storedName = `${v4()}.${getFileExtension(file.mimetype)}`;
    const url = `${process.env.FILE_PATH}/api/attachments/${storedName}`;

    // TODO -> Depending on mime type we should direct it to the right directory inside the attachments
    file.mv(`${path.resolve()}/attachments/files/${storedName}`, (err: any) => {
      if (err) {
        throw new HttpError(ERROR_MESSAGES.FILE_UPLOAD_FAILED, 500);
      }
    });

    const createdAttachment = (new Attachments({ url, uploadName, name: storedName, })).save();

    res.status(201).json({ attachment: createdAttachment });
  } catch (e) {
    return next(new HttpError(ERROR_MESSAGES.GENERIC));
  }
};

export const deleteAttachment = async (req: any, res: any, next: NextFunction) => {
  const fileName = req.params.fileName;

  try {
    await Attachments.delete(fileName);
  } catch (e) {
    return next(new HttpError(e as any));
  }

  try {
    fs.unlink(`${path.resolve()}/attachments/files/${fileName}`, function (err) {
      if (err) throw err;
      console.log('File deleted!', fileName);
    });

  } catch (e) {
    return next(new HttpError(e as any));
  }

  res.status(200).json({ successMessage: MESSAGES.DELETED_SUCCESSFULLY });
};
