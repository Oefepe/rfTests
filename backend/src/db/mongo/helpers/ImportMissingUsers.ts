import { User } from '../models/userModel';
import { Auth } from '../models/authModel';
import config from '../../../config/config';
import mongoose from 'mongoose';
import * as fs from 'fs';

// Define the function to read JSON file
async function readJsonFile(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const jsonArray: any[] = [];

    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

    let buffer = '';
    readStream.on('data', (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n');

      // Parse each line as JSON object
      lines.forEach((line, index) => {
        if (index === lines.length - 1) {
          // Last line might be incomplete, so we keep it in the buffer
          buffer = line;
        } else {
          try {
            const jsonObject = JSON.parse(line);
            jsonArray.push(jsonObject);
          } catch (error) {
            reject(error);
          }
        }
      });
    });

    readStream.on('end', () => {
      // Parse the remaining buffer
      if (buffer.trim() !== '') {
        try {
          const jsonObject = JSON.parse(buffer);
          jsonArray.push(jsonObject);
        } catch (error) {
          reject(error);
        }
      }

      resolve(jsonArray);
    });

    readStream.on('error', (error) => {
      reject(error);
    });
  });
}

// Function to import data
async function importData() {
  console.log('Importing data...');

  try {
    // Establish Mongoose connection
    await mongoose.connect(config.mongo.url, {
      retryWrites: true,
      w: 'majority',
    });

    const jsonFilePath = 'users.json';

    // Read the JSON file
    const users = await readJsonFile(jsonFilePath);

    // Iterate through each user in the JSON file
    for (const user of users) {
      try {
        // Check if the user exists in the database

        const email: string = user.email;
        const formattedEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email: formattedEmail });

        // If the user doesn't exist, insert them into the database
        if (!existingUser) {
          console.log(`User ${formattedEmail} does not exist. Inserting...`);

          const userObj = await User.create(user);

          console.log(`User ${formattedEmail} inserted successfully.`);

          const newAuthId = {
            userName: `email-${formattedEmail}`,
            provider: 'email',
            userId: userObj._id,
            revision: 1,
          };

          // Insert the new auth document into the Auth collection
          await Auth.create(newAuthId);
          console.log(
            `Auth document for user ${userObj.email} inserted successfully.`
          );
        } else {
          console.log(`User ${user.email} already exists.`);
        }
      } catch (error) {
        console.error('Error creating new user', error);
      }
    }

    console.log('Migration completed.');
  } catch (error) {
    console.error('Error during data import:', error);
  } finally {
    // Close the Mongoose connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Call the importData function
importData()
  .then(() => {
    console.log('Data import completed.');
  })
  .catch((error) => {
    console.error('Error during data import:', error);
  });
