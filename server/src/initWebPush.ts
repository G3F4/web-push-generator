import { setVapidDetails } from 'web-push';

const publicVapidKey = process.env.PUBLIC_VAPID_KEY || '';
const privateVapidKey = process.env.PRIVATE_VAPID_KEY || '';

export default () => {
  setVapidDetails(
    'mailto:g3f4.lifeapp@gmail.com',
    publicVapidKey,
    privateVapidKey,
  );
};
