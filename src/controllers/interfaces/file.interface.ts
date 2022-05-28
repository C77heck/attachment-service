export interface FileInterface {
  name: string,
  data: Buffer,
  size: number,
  encoding: string | '7bit',
  tempFilePath?: string,
  truncated: boolean,
  mimetype: string | 'image/png',
  md5: string,
  mv: Function
}
