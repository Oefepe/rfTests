import stageElements from '../db/mongo/models/stageElements';
import StageElementDTO from '../dto/StageElementDTO';
import { RFNGAppError } from '../utils/ErrorHandler';
import HttpCode from '../config/httpCode';
import { smartConnectorMsg } from '../config/messages';
import { logErrorType } from '../utils/commonErrorLogging';

export const createActionForAStage = async (
  actionObj: StageElementDTO
): Promise<{}> => {
  try {
    //Validation for delay element (Do not allow to add delay after delay )
    if (actionObj.nodeType.toString() === '3') {
      if (!actionObj.parentId || actionObj.parentId === '') {
        throw new RFNGAppError({
          statusCode: HttpCode.UNPROCESSABLE_ENTITY,
          message: smartConnectorMsg.notAllowedToAddDelayAsFirstElement,
        });
      }

      const element = await getTheStageElementById(
        actionObj.smartConnectorId,
        actionObj.stageId,
        actionObj.parentId
      );
      if (element.nodeType === 3) {
        throw new RFNGAppError({
          statusCode: HttpCode.UNPROCESSABLE_ENTITY,
          message: smartConnectorMsg.notAllowedToAddDelayAfterDelay,
        });
      }
    }
    const newStageAction = new stageElements(actionObj);
    const stageAction = await newStageAction.save();

    return stageAction;
  } catch (error) {
    logErrorType(error, 1024, {
      parentId: actionObj?.parentId,
      smartConnectorId: actionObj?.smartConnectorId,
      stageId: actionObj?.stageId,
    });

    return Promise.reject(error);
  }
};

export const updateActionForAStage = async (
  actionId: string,
  actionObj: StageElementDTO
): Promise<{}> => {
  try {
    const filter = { id: actionId };
    const stageAction = await stageElements.updateOne(filter, actionObj);

    return stageAction;
  } catch (error) {
    return Promise.reject(error);
  }
};

//Function to get the smart connectors with it's staged for a particular smart connector
export const getTheStageElements = async (
  smartConnectorId: string,
  stageId: string
) => {
  try {
    // 0 means ignore the column & 1 means fetch the column details.
    const stageElements = await getTheStageElementsDetail(
      smartConnectorId,
      stageId
    );

    if (!stageElements) {
      throw new RFNGAppError({
        statusCode: HttpCode.UNPROCESSABLE_ENTITY,
        message: smartConnectorMsg.noScOrStageFound,
      });
    } else {
      return stageElements;
    }
  } catch (err) {
    logErrorType(err, 1025, { smartConnectorId, stageId });
    return Promise.reject(err);
  }
};

// Function to get element by Id
export const getTheStageElementById = async (
  smartConnectorId: string,
  stageId: string,
  elementId: string
) => {
  const element = await stageElements.findOne({
    smartConnectorId: smartConnectorId,
    stageId: stageId,
    id: elementId,
  });
  if (element) {
    return element;
  } else {
    throw new RFNGAppError({
      statusCode: HttpCode.UNPROCESSABLE_ENTITY,
      message: smartConnectorMsg.noElementFoundWithId,
    });
  }
};

// Function to get element by Id
export const getActionDetails = async (elementId: string) => {
  const element = await stageElements.findOne({
    id: elementId,
  });
  if (element) {
    return element;
  } else {
    throw new RFNGAppError({
      statusCode: HttpCode.UNPROCESSABLE_ENTITY,
      message: smartConnectorMsg.noElementFoundWithId,
    });
  }
};

//Function to get smart connectors
const getTheStageElementsDetail = async (
  smartConnectorId: string,
  stageId: string
) => {
  return stageElements.aggregate([
    {
      $match: {
        $and: [
          { smartConnectorId: smartConnectorId },
          { stageId: stageId },
          { parentId: '' },
        ],
      },
    },
    {
      $graphLookup: {
        from: 'stageelements',
        startWith: '$id',
        connectFromField: 'id',
        connectToField: 'parentId',
        depthField: 'level',
        as: 'children',
      },
    },
    {
      $unwind: {
        path: '$children',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: {
        'children.level': -1,
      },
    },
    {
      $group: {
        _id: '$id',
        id: {
          $first: '$id',
        },
        parentId: {
          $first: '$parentId',
        },
        name: {
          $first: '$name',
        },
        nodeType: {
          $first: '$nodeType',
        },
        stageId: {
          $first: '$stageId',
        },
        smartConnectorId: {
          $first: '$smartConnectorId',
        },
        children: {
          $push: '$children',
        },
      },
    },
    {
      $addFields: {
        children: {
          $reduce: {
            input: '$children',
            initialValue: {
              level: -1,
              presentChild: [],
              prevChild: [],
            },
            in: {
              $let: {
                vars: {
                  prev: {
                    $cond: [
                      {
                        $eq: ['$$value.level', '$$this.level'],
                      },
                      '$$value.prevChild',
                      '$$value.presentChild',
                    ],
                  },
                  current: {
                    $cond: [
                      {
                        $eq: ['$$value.level', '$$this.level'],
                      },
                      '$$value.presentChild',
                      [],
                    ],
                  },
                },
                in: {
                  level: '$$this.level',
                  prevChild: '$$prev',
                  presentChild: {
                    $concatArrays: [
                      '$$current',
                      [
                        {
                          $mergeObjects: [
                            '$$this',
                            {
                              children: {
                                $filter: {
                                  input: '$$prev',
                                  as: 'e',
                                  cond: {
                                    $eq: ['$$e.parentId', '$$this.id'],
                                  },
                                },
                              },
                            },
                          ],
                        },
                      ],
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        children: '$children.presentChild',
      },
    },
  ]);
};
