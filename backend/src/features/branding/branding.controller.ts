import { Request, Response } from 'express';
import HttpCode from '../../config/httpCode';
import * as BrandingService from './branding.service';
import { ResponseCode } from '../../entities';
import { logErrorType } from '../../utils/commonErrorLogging';
import { JSDOM } from 'jsdom';
import { getUserByLegacyId } from '../../services/userService';
import { ErrorType, RFNGError } from '../../utils/error';

export const getBrandingData = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;

    const data = await BrandingService.getBrandingData(accountId);
    return res.status(HttpCode.OK).json({ status: ResponseCode.success, data });
  } catch (exception) {
    logErrorType(exception, 1037, { accountId: req?.params });
    return res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
};

export const getTerms = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { agent } = req.query;
    const url =
      type === 'privacy'
        ? 'https://rapidfunnel.com/privacy_policy_terms/'
        : 'https://rapidfunnel.com/terms-conditions/';

    const response = await fetch(url);
    const body = await response.text();

    const dom = new JSDOM(body);
    const pageContent = dom.window.document.querySelector('div.page-contents');
    const textContent = pageContent?.querySelector(
      'div.elementor-widget-container'
    );
    const sanitizedText = textContent?.innerHTML
      // remove existing style classes
      .replace(/\sclass="[^"]*"/g, '')
      // remove new lines and tabulation
      .replace(/\n/g, '')
      .replace(/\t/g, '')
      // replace double quotes with single quotes to
      // avoid mistakes in JSON format
      .replace(/"/g, "'")
      // to keep consistence with current app design,
      // h2 replaced with h1 and h5 with h2
      .replace(/h2/g, 'h1')
      .replace(/h5/g, 'h2')
      // navigate through anchors at the same window
      .replace(/href='#/g, "target='_self' href='#")
      // open external links in the separate window/tab
      .replace(/href='http/g, "target='_blank' href='http");

    const htmlWrapper = (content?: string, scale = '1.0') =>
      `
    <!doctype html>
      <html lang='en'>
      <head>
        <meta charset='UTF-8'>
        <meta
          name='viewport'
          content='width=device-width,
          user-scalable=no,
          initial-scale=${scale}'
          >
        <title>Document</title>
        <style>
          body { font-size: 1.6rem; font-family: sans-serif; }
          h1 { text-align: center; padding-bottom: 2rem; }
          h2 { padding-bottom: 1rem; }
          p { padding-bottom: 2rem; }
        </style>
      </head>
    <body>${content}</body></html>`.replace(/\n/g, '');

    const text = htmlWrapper(sanitizedText, agent === 'mobile' ? '0.5' : '1.0');

    return res.status(HttpCode.OK).json({ status: ResponseCode.success, text });
  } catch (error) {
    logErrorType(error, 2017, {
      licenseType: req.params.type,
      agent: req.query.agent ?? 'web',
    });
    return res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
};

export const getBrandingByLegacyUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const context = { userId };

    const formattedUserId = Number(userId);
    const userData = await getUserByLegacyId(formattedUserId);

    if (!userData?._id) {
      throw new RFNGError(
        5013,
        'User not found to fetch branding data',
        context,
        ErrorType.Warning
      );
    }

    // Get the matching account based on legacy userId
    const account = userData.accounts?.find(
      (acc) => acc.userId === formattedUserId
    );

    if (!account?.accountId) {
      throw new RFNGError(
        9006,
        'Could not get accountId of user',
        context,
        ErrorType.Warning
      );
    }

    const accountId = account.accountId.toString();

    const data = await BrandingService.getBrandingData(accountId);
    return res.status(HttpCode.OK).json({ status: ResponseCode.success, data });
  } catch (exception) {
    logErrorType(exception, 1037, { userId: req?.params });
    return res.status(HttpCode.OK).json({ status: ResponseCode.error });
  }
};
