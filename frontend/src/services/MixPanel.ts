import { init } from 'mixpanel-browser';
import { config } from '../config/config';

const dummyMixpanel = {
  track: () => {},
  identify: () => {},
  people: {
    set: () => {},
  },
  reset: () => {},
};

const mixpanelInstance = config.mixpanel_token
  ? init(
      config.mixpanel_token,
      {
        debug: true,
        track_pageview: false,
        persistence: 'localStorage',
      },
      'mixpanel'
    )
  : dummyMixpanel;

export { mixpanelInstance as mixpanel };
