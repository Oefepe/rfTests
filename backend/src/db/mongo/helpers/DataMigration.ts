import { User } from '../models/userModel';
import { Auth } from '../models/authModel';
import config from '../../../config/config';
import mongoose from 'mongoose';

// Function to import data
async function importData() {
  console.log('Importing data...');

  // Establish Mongoose connection
  await mongoose.connect(config.mongo.url, {
    retryWrites: true,
    w: 'majority',
  });

  const batchSize = 5;

  // Initialize cursor to iterate over users
  const cursor = User.find({}).cursor({ batchSize: batchSize });

  // const users = await User.find({});

  for await (const user of cursor) {
    try {
      // Generate new auth document for the user
      if (!user.email) {
        console.log('User: ', user);
        break;
      }
      const newAuthId = {
        userName: `email-${user.email}`,
        provider: 'email',
        userId: user._id,
        revision: 1,
      };

      // Insert the new auth document into the Auth collection
      await Auth.create(newAuthId);
    } catch (error) {
      console.error('Error creating new auth document:', error);
    }
  }

  console.log('authIds generation completed.');
}

// Call the importData function
importData()
  .then(() => {
    console.log('Data import completed.');
  })
  .catch((error) => {
    console.error('Error during data import:', error);
  });
