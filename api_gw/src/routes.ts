import { COACHING, NOTIFICATIONS, RFNG } from './constants';

export const proxyRoutes: { path: string; accessTag: string; server: string }[] = [
  { path: '/api/auth', accessTag: 'public', server: RFNG },
  { path: '/api/log', accessTag: 'public', server: RFNG },
  { path: '/api/mail', accessTag: 'auth', server: RFNG },
  { path: '/api/user', accessTag: 'auth', server: RFNG },
  { path: '/api/branding', accessTag: 'public', server: RFNG },
  { path: '/api/license', accessTag: 'public', server: RFNG },
  { path: '/api/notifications', accessTag: 'auth', server: NOTIFICATIONS },
  { path: '/notifications', accessTag: 'auth', server: NOTIFICATIONS },
  { path: '/api/coaching', accessTag: 'auth', server: COACHING },
  { path: '/coaching', accessTag: 'auth', server: COACHING },
];
