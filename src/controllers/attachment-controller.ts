import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 } from 'uuid';
import { ERROR_MESSAGES, MESSAGES } from '../libs/constants';
import Attachments from '../models/attachment.model';
import { HttpError } from '../models/http.error';
import { FileInterface } from './interfaces/file.interface';

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
    // const storedName = `${v4()}.${getFileExtension(file.mimetype)}`;
    const name = `${v4()}.webp`;
    const url = `${process.env.FILE_PATH}/api/attachments/${name}`;
    const save = `${path.resolve()}/attachments/files/${name}`;

    switch (req.body.compressionQuality) {
      case 'low':
        await sharp(file.data)
          .webp({ quality: 40, })
          .toFile(save);
        break;
      case 'medium':
        await sharp(file.data)
          .webp({ quality: 80 })
          .toFile(save);
        break;
      case 'high':
        await sharp(file.data)
          .webp({ quality: 100 })
          .toFile(save);
        break;
      default:
        file.mv(`${path.resolve()}/attachments/files/${name}`, (err: any) => {
          if (err) {
            throw new HttpError(ERROR_MESSAGES.FILE_UPLOAD_FAILED, 500);
          }
        });
        break;
    }

    const createdAttachment = new Attachments({
      url, uploadName, name,
      size: file.size,
      encoding: file.encoding,
      mimeType: file.mimetype
    });

    createdAttachment.save();

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
