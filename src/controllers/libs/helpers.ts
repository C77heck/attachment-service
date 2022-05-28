export const getFileExtension = (mime: string) => {
  const array = mime.split('/');
  return array[array.length - 1];
};
