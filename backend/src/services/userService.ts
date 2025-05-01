import smConnectContactLog from '../db/mongo/models/scContactLog';
import { User } from '../db/mongo/models/userModel';
import { IUser } from '../entities';
import { logErrorType } from '../utils/commonErrorLogging';
import { RFNGError } from '../utils/error';
import { deleteAuthIdByIds, getAuthIdsByUserId } from './authService';
import { logError, logInfo } from './log';
import { Auth } from '../db/mongo/models/authModel';

const getUserByUsername = async (username: string): Promise<IUser | null> => {
  return User.findOne({ username }).lean();
};

const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email: email.toLowerCase() });
};

const getUserByLegacyId = async (legacyId: number): Promise<IUser | null> => {
  const usersList: IUser[] = await User.find({
    accounts: { $elemMatch: { userId: legacyId } },
  });

  if (usersList.length === 1) {
    return usersList[0];
  }

  if (usersList.length > 1) {
    logError({
      errorCode: 1067,
      message: `Multiple users found with legacyId: ${legacyId}`,
      context: { usersList },
    });
  }

  return null;
};

const createUser = async (user: IUser) => {
  user.createdAt = new Date();
  user.modifiedAt = new Date();
  user.displayName = `${user.firstName} ${user.lastName}`;
  if (user.email) {
    user.email = user.email.toLowerCase();
  }

  return new User(user).save();
};

const updateUser = async (id: string, userData: Partial<IUser>) => {
  const existingData = await User.findById(id).lean();
  const firstName = userData.firstName ?? existingData?.firstName;
  const lastName = userData.lastName ?? existingData?.lastName;
  userData.displayName = `${firstName} ${lastName}`;
  if (userData.email) {
    userData.email = userData.email.toLowerCase();
  }
  userData.modifiedAt = new Date();
  return User.findByIdAndUpdate(id, userData);
};

const getUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id).lean();
};

const deleteUserById = async (id: string) => {
  return User.findByIdAndDelete(id);
};

const removeUserByLegacyId = async (userId: number) => {
  let context: Record<string, unknown> = { legacyUserId: userId };

  const userData = await getUserByLegacyId(userId);
  if (!userData?._id) {
    throw new RFNGError(1009, 'User not found by legacy userId', context);
  }

  if (!userData?.accounts?.length) {
    throw new RFNGError(
      1009,
      'No accounts found in userData for existing user',
      {
        ...context,
        rfngUserData: userData,
      }
    );
  }

  const authIds = await getAuthIdsByUserId(userData?._id);
  context = { ...context, authIds };
  if (!authIds?.length) {
    throw new RFNGError(1059, 'Found user without authId', {
      ...context,
      rfngUserId: userData._id,
    });
  }

  // Delete user related data first
  await deleteUserRelatedData(userData._id);

  if (userData.accounts.length === 1) {
    const deletionList = authIds.map((authId) => authId._id);
    const deletionResults = await deleteAuthIdByIds(deletionList);
    context = { ...context, deletionResults };

    if (deletionList.length !== deletionResults.deletedCount) {
      throw new RFNGError(1064, 'Delete authId error', {
        ...context,
        rfngUserId: userData._id,
        deletionList,
        deletionResults: `${deletionResults.deletedCount} of ${deletionList.length} was deleted`,
      });
    }

    const deletionResult = await deleteUserById(userData._id);
    context = { ...context, deletionResult, userDeletionId: userData._id };

    logInfo({
      message: 'removeUserByLegacyId: user deleted',
      context,
    });
  } else {
    const accounts = userData.accounts?.filter((a) => a.userId !== userId);
    await updateUser(userData._id, { accounts });
  }

  return {
    legacyUserId: userId,
    rfngUserId: userData._id,
  };
};

const deleteUsersByAccountId = async (accountId: number) => {
  const context: Record<string, unknown> = { legacyAccountId: accountId };

  try {
    // Find all users with the specified accountId
    const users = await User.find({
      'accounts.accountId': accountId,
    });

    if (users.length === 0) {
      return;
    }

    const userIdsToDelete = [];
    const userIdsToUpdate = [];

    for (const user of users) {
      if (user.accounts.length === 1) {
        // If the user has only one account, delete the user and authId
        userIdsToDelete.push(user._id);
      } else {
        // If the user has multiple accounts, add them to the update list
        userIdsToUpdate.push(user._id);
      }
    }

    // Convert userIds to strings for deleting user related data
    const userIdsToDeleteFormatted = userIdsToDelete.map((id) => id.toString());

    if (userIdsToDelete.length > 0) {
      await User.deleteMany({ _id: { $in: userIdsToDelete } });
      await Auth.deleteMany({ userId: { $in: userIdsToDeleteFormatted } });
      // Log the deletion
      logInfo({
        message: 'Deleted users and authIds of account',
        context: { ...context, userIds: userIdsToDelete },
      });
    }

    if (userIdsToUpdate.length > 0) {
      // Remove the specific account from list of accounts
      await User.updateMany(
        { _id: { $in: userIdsToUpdate } },
        { $pull: { accounts: { accountId } } }
      );
      logInfo({
        message: 'Updated users to remove specified account',
        context: { ...context, userIds: userIdsToUpdate },
      });
    }

    // Batch deletion of user-related data
    if (userIdsToDelete.length > 0) {
      await smConnectContactLog.deleteMany({
        userId: { $in: userIdsToDeleteFormatted },
      });
      // Log the deletion
      logInfo({
        message: 'Deleted Smart Connector Logs of users',
        context: { ...context, userIds: userIdsToDelete },
      });
    }

    logInfo({
      message: 'deleteUsersByAccountId: Account users deleted',
      context,
    });

    return {
      usersDeleted: userIdsToDelete.length,
      usersUpdated: userIdsToUpdate.length,
    };
  } catch (error) {
    logErrorType(error, 1072, {
      legacyAccountId: accountId,
      errorMessage: 'Error while deleting all users of an account',
    });
  }
};

const deleteUserRelatedData = async (rfngUserId: string) => {
  try {
    const scLogDeletionResult = await smConnectContactLog.deleteMany({
      userId: rfngUserId,
    });

    if (scLogDeletionResult.deletedCount > 0) {
      logInfo({
        message: 'smConnectContactLog of user deleted successfully',
        context: {
          rfngUserId,
          deletedCount: scLogDeletionResult.deletedCount,
        },
      });
    } else {
      logInfo({
        message: 'No smConnectContactLog found to delete for the user',
        context: { rfngUserId },
      });
    }
  } catch (e) {
    logErrorType(e, 1071, {
      rfngUserId,
      errorMessage: 'Error occurred while deleting user related data',
    });
  }
};

export {
  createUser,
  getUserByUsername,
  getUserByEmail,
  getUserByLegacyId,
  updateUser,
  getUserById,
  deleteUserById,
  removeUserByLegacyId,
  deleteUsersByAccountId,
};
