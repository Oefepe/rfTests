import fs from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';
import { resourceConfig } from '../controllers/resource/config';
import { logErrorType } from '../utils/commonErrorLogging';

const createResourceFile = async (data: any) => {
  try {
    const fileName = `${data.name}.json`;

    // Replace spaces in string with underscore so we can read dir path
    const formattedFileName = fileName.replace(/\s/g, '%20');

    const directory = getResourceDirectory(
      data.accountId,
      data.category,
      data.type
    );

    // Ensure that the directory exists, create it if it doesn't exist
    await fs.mkdir(directory, { recursive: true });

    // Create the final path to store the resource file
    const filePath = path.join(directory, formattedFileName);

    // Format the request data to write to file
    const resourceData = formatData(data);

    // Write the JSON data to the file
    await fs.writeFile(filePath, resourceData);
  } catch (error) {
    logErrorType(error, 1007, { data });
    throw error;
  }
};

// Function to format resource file data
const formatData = (data: any) => {
  switch (data.type) {
    case 'link': {
      const linkResource = {
        name: data.name,
        link: data.link,
        description: data.description,
      };
      return JSON.stringify(linkResource, null, 2);
    }
    default:
      return JSON.stringify({}, null, 2);
  }
};

const generateRandomUUID = () => {
  // Generate 16 random bytes (128 bits)
  const randomBytesBuffer = randomBytes(16);

  // Convert the bytes to a hexadecimal string
  const uuid = randomBytesBuffer
    .toString('hex')
    .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5'); // Format the UUID as "8-4-4-4-12"

  return uuid;
};

interface IResourceFileContent {
  link: string;
  name: string;
  id: string;
}

const readResourceFile = async (directoryPath: string) => {
  try {
    const files = await fs.readdir(directoryPath);
    const resourceList: IResourceFileContent[] = await Promise.all(
      files.map(async (filename) => {
        const fileContent = await fs.readFile(
          `${directoryPath}/${filename}`,
          'utf8'
        );
        return JSON.parse(fileContent);
      })
    );
    return resourceList;
  } catch (error) {
    logErrorType(error, 1008, { directoryPath });
    throw error;
  }
};

const getResourceDirectory = (
  accountId: string,
  category: string,
  resourceType: string
) => {
  // Replace spaces in string with underscore so we can read dir path
  const formattedCategory = category.replace(/\s/g, '%20');

  // Construct path based on accountId, category, and resourceType
  const accountDirectory = getAccountResourceDirectory(accountId);
  const directoryPath = path.join(
    accountDirectory,
    'user',
    'en',
    formattedCategory,
    resourceType
  );

  return directoryPath;
};

export const getAccountResourceDirectory = (accountId: string) => {
  const directoryPath = path.join(resourceConfig.baseDirectory, accountId);

  return directoryPath;
};

export default {
  createResourceFile,
  readResourceFile,
  getResourceDirectory,
  getAccountResourceDirectory,
};
