import { BsCloudDownloadFill, BsPeopleFill } from 'react-icons/bs';
export const PROFILE_MENU_ITEMS = [{
  key: 'profile-feed',
  label: 'Akış',
  url: '/profile/feed',
  parentKey: 'pages-profile'
}, {
  key: 'profile-about',
  label: 'Hakkında',
  url: '/profile/about',
  parentKey: 'pages-profile'
}, {
  key: 'profile-activity',
  label: 'Nesebi / Soy Bağı',
  url: '/profile/activity',
  parentKey: 'pages-profile'
}, {
  key: 'profile-connections',
  label: 'Kitaplar',
  url: '/profile/connections',
  parentKey: 'pages-profile'
}/*, {
  key: 'profile-media',
  label: 'Medya',
  url: '/profile/media',
  parentKey: 'pages-profile'
}, {
  key: 'profile-videos',
  label: 'Videolar',
  url: '/profile/videos',
  parentKey: 'pages-profile'
} , {
  key: 'profile-events',
  label: 'Etkinlikler',
  url: '/profile/events',
  parentKey: 'pages-profile'
} */];

export const APP_MENU_ITEMS = [{
  key: 'my-network',
  isTitle: true,
  icon: BsPeopleFill,
  url: '/feed/who-to-follow'
}];
