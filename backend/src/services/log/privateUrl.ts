import config from '../../config/config';

export const isPrivateApi = (url: string) => {
  const urlParts = url.match(/(\w)+/g);
  return urlParts
    ? urlParts.some((part) => config.logs.privateApi.includes(part))
    : false;
};
