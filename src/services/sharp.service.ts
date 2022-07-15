import sharp from 'sharp';

export class SharpService {
  public static async resize(file: Buffer, savePath: string, extension: string, quality?: 'high' | 'medium' | 'low') {
    try {
      switch (quality) {
        case 'low':
          await sharp(file)
            .webp({ quality: 40, })
            .toFile(savePath);
          break;
        case 'medium':
          await sharp(file)
            .webp({ quality: 80 })
            .toFile(savePath);
          break;
        case 'high':
          await sharp(file)
            .webp({ quality: 100 })
            .toFile(savePath);
          break;
        default:
          throw {};
      }
    } catch (e) {
      await sharp(file).toFile(savePath);
      // fs.writeFile(`test.${extension}`, file, {}, (err: any) => {
      //   if (err) {
      //     throw new HttpError(ERROR_MESSAGES.FILE_UPLOAD_FAILED, 500);
      //   }
      // });
    }

  }
}
