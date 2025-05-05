import { NextFunction, Request, Response } from 'express';
import HttpCode from '../config/httpCode';
import StatisticsModel from '../db/mysql/models/statistics';
import { logErrorType } from '../utils/commonErrorLogging';

const defaultFromDate = new Date('2023-05-31');

const getSelectedFromDate = (date: string | undefined) =>
  date === undefined || date === null || new Date(date) > defaultFromDate
    ? defaultFromDate.toISOString().slice(0, 10)
    : date;

export const getInactiveContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fromDate, toDate } = req.query as {
      fromDate?: string;
      toDate?: string;
    };

    const results = await StatisticsModel.getInactiveContacts(
      getSelectedFromDate(fromDate),
      getSelectedFromDate(toDate)
    );

    return res.status(HttpCode.OK).json({ data: results });
  } catch (exception) {
    logErrorType(exception, 5006);
    res.status(HttpCode.OK).json({
      error: 'Could not fetch inactive contacts by stage.',
    });
  }
};

export const getContactsTransition = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = req.query as {
      fromDate?: string;
      toDate?: string;
    };

    const results = await StatisticsModel.getContactsTransition(
      getSelectedFromDate(fromDate),
      getSelectedFromDate(toDate)
    );

    return res.status(HttpCode.OK).json({ data: results });
  } catch (exception) {
    logErrorType(exception, 5007);
    res.status(HttpCode.OK).json({
      error: 'Could not fetch inactive contacts by stage.',
    });
  }
};

export const getContactsTimeInStage = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = req.query as {
      fromDate?: string;
      toDate?: string;
    };

    const results = await StatisticsModel.getContactsTimeInStage(
      getSelectedFromDate(fromDate),
      getSelectedFromDate(toDate)
    );

    return res.status(HttpCode.OK).json({ data: results });
  } catch (exception) {
    logErrorType(exception, 5008);
    res.status(HttpCode.OK).json({
      error: 'Could not fetch inactive contacts by stage.',
    });
  }
};

export const getContactStageTransition = async (
  req: Request,
  res: Response
) => {
  try {
    const { fromDate, toDate } = req.query as {
      fromDate?: string;
      toDate?: string;
    };

    const results = await StatisticsModel.getContactStageTransition(
      getSelectedFromDate(fromDate),
      getSelectedFromDate(toDate)
    );

    return res.status(HttpCode.OK).json({ data: results });
  } catch (exception) {
    logErrorType(exception, 5009);
    res.status(HttpCode.OK).json({
      error: 'Could not fetch inactive contacts by stage.',
    });
  }
};

export const getTransitionActionCount = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = req.query as {
      fromDate?: string;
      toDate?: string;
    };

    const results = await StatisticsModel.getTransitionActionCount(
      getSelectedFromDate(fromDate),
      getSelectedFromDate(toDate)
    );

    return res.status(HttpCode.OK).json({ data: results });
  } catch (exception) {
    logErrorType(exception, 5010);
    res.status(HttpCode.OK).json({
      error: 'Could not fetch inactive contacts by stage.',
    });
  }
};

export const getContactsTransitionTime = async (
  req: Request,
  res: Response
) => {
  try {
    const { fromDate, toDate } = req.query as {
      fromDate?: string;
      toDate?: string;
    };

    const results = await StatisticsModel.getContactsTransitionTime(
      getSelectedFromDate(fromDate),
      getSelectedFromDate(toDate)
    );

    return res.status(HttpCode.OK).json({ data: results });
  } catch (exception) {
    logErrorType(exception, 5011);
    res.status(HttpCode.OK).json({
      error: 'Could not fetch inactive contacts by stage.',
    });
  }
};
