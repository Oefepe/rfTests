import axios from 'axios';
import { config } from '../config/config';
import { Buffer } from 'buffer';

enum ResourceURLs {
  getResources = 'v2/resource-list?accountId',
}

interface Resource {
  id: number;
  name: string;
}

export const getResourceList = async (accountId: string | number) => {
  try {
    const response = await axios({
      url: config.lumen_url + `${ResourceURLs.getResources}=${accountId}`,
      method: 'get',
    });
    return response.data.data as Resource[];
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAccountId = (encodedUrl: string) => {
  try {
    const decodefromUrl = (str?: string) =>
      Buffer.from(str as string, 'base64').toString('utf8');
    const decodedString = decodefromUrl(encodedUrl);
    /*  fetching the param value from the url decoded string */
    const urlParamValue = new URLSearchParams(decodedString).get('accountId');
    return urlParamValue;
  } catch (error) {
    return Promise.reject(error);
  }
};
