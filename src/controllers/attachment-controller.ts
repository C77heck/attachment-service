import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { ERROR_MESSAGES, MESSAGES } from '../libs/constants';
import Attachments from '../models/attachment.model';
import { HttpError } from '../models/http.error';
import { SharpService } from '../services/sharp.service';

export interface FileData {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string | "image/png";
  webkitRelativePath: string;
  file: Buffer; // base64
  mv: Function;
  compressionQuality?: 'high' | 'low' | 'medium';
}

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
    const body: FileData = req.body;
    // const file = body.file;
    const file = Buffer.from(body.file, 'base64' as any);
    // console.log(file);

    const uploadName = body?.name;
    const name = `${v4()}.webp`;
    const url = `${process.env.FILE_PATH}/api/attachments/${name}`;
    const savePath = `${path.resolve()}/attachments/files/${name}`;

    await SharpService.resize(file, savePath, body.type.split('/')[1], body?.compressionQuality);

    const createdAttachment = new Attachments({
      url, uploadName, name,
      size: body.size,
      encoding: 'utf8',
      mimeType: body.type
    });
    console.log(3);
    createdAttachment.save();

    res.status(201).json({ attachment: createdAttachment });
  } catch (e) {
    console.log(e);
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
