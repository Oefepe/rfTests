import { BrandingItem, isBrandingData } from './branding.entities';
import { getBrandingData as legacyBrandingData } from '../legacyApi';
import config from '../../config/config';
import { ErrorType, RFNGError } from '../../utils/error';
import { logErrorType } from '../../utils/commonErrorLogging';

const getBrandingData = async (accountId: string): Promise<BrandingItem> => {
  const context = { accountId };

  try {
    const brandingData = await legacyBrandingData(accountId);
    if (!isBrandingData(brandingData)) {
      throw new RFNGError(
        9006,
        'Branding data is not valid',
        context,
        ErrorType.Warning
      );
    }
    const webUrl = config.legacyWebUrl;
    const brandingItem = new BrandingItem(
      brandingData,
      `${webUrl}uploads/branding/account/${accountId}/`
    );
    return brandingItem;
  } catch (error) {
    logErrorType(
      error,
      9005,
      {
        accountId,
        reason: 'Branding on legacy not available',
      },
      ErrorType.Warning
    );
  }

  return {
    id: '0',
    accountName: 'RapidFunnel',
    primaryColor: '#77B800',
    primaryColorOffset: '#fff',
    secondaryColor: '#fff',
    secondaryColorOffset: '#767676',
    tertiaryColor: '#0096db',
    tertiaryColorOffset: '#00afff',
    hidePoweredByRFLogoOnResources: true,
    removeRFLogoOnDashboard: true,
    useRFSupportLink: true,
    appDetails: {
      googlePlayUrl:
        'https://play.google.com/store/apps/details?id=com.rapidfunnel',
      appStoreUrl: 'https://apps.apple.com/us/app/rapidfunnel-inc/id948835721',
    },
  };
};

export { getBrandingData };
