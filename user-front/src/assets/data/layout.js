import homeImg from '@/assets/images/icon/home-outline-filled.svg';
import personImg from '@/assets/images/icon/person-outline-filled.svg';
import medalImg from '@/assets/images/icon/medal-outline-filled.svg';
import clockImg from '@/assets/images/icon/clock-outline-filled.svg';
import earthImg from '@/assets/images/icon/earth-outline-filled.svg';
import notificationImg from '@/assets/images/icon/notification-outlined-filled.svg';
import cogImg from '@/assets/images/icon/cog-outline-filled.svg';
import bookOpenImg from '@/assets/images/icon/book-open-outline-filled.svg';
import bookImg from '@/assets/images/icon/book-outline-filled.svg';
import likeImg from '@/assets/images/icon/like-outline-filled.svg';
import starImg from '@/assets/images/icon/star-outline-filled.svg';
import taskDoneImg from '@/assets/images/icon/task-done-outline-filled.svg';
import arrowBoxedImg from '@/assets/images/icon/arrow-boxed-outline-filled.svg';
import shieldImg from '@/assets/images/icon/shield-outline-filled.svg';
import handshakeImg from '@/assets/images/icon/handshake-outline-filled.svg';
import chatAltImg from '@/assets/images/icon/chat-alt-outline-filled.svg';
import trashImg from '@/assets/images/icon/trash-var-outline-filled.svg';
import clipboardImg from '@/assets/images/icon/clipboard-list-outline-filled.svg';
import microphoneImg from '@/assets/images/icon/chat-alt-outline-filled.svg'; // Geçici olarak chat-alt kullanıyoruz
export const profilePanelLinksData1 = [{
  image: homeImg,
  nameKey: 'menu.feed',
  link: '/profile/feed'
},{
  image: earthImg,
  nameKey: 'menu.worldNews',
  link: '/blogs'
}, {
  image: bookOpenImg,
  nameKey: 'menu.islamicScholars',
  link: '/feed/scholars'
},{
  image: personImg,
  nameKey: 'menu.users',
  link: '/feed/who-to-follow'
},   {
  image: bookImg,
  nameKey: 'menu.books',
  link: '/feed/books'
}, {
  image: clipboardImg,
  nameKey: 'menu.articles',
  link: '/feed/articles'
}, {
  image: microphoneImg,
  nameKey: 'menu.podcast',
  link: '/feed/podcasts'
}, {
  image: cogImg,
  nameKey: 'menu.settings',
  link: '/settings/account'
}];
export const profilePanelLinksData2 = [{
  image: homeImg,
  name: 'Akış',
  link: '/profile/feed'
}, {
  image: medalImg,
  name: 'Popüler',
  link: ''
}, {
  image: clockImg,
  name: 'Yakın zamanda',
  link: ''
}, {
  image: likeImg,
  name: 'Abonelikler',
  link: ''
}, {
  image: starImg,
  name: 'Favorilerim',
  link: ''
}, {
  image: taskDoneImg,
  name: 'Favori Listesi',
  link: ''
}, {
  image: notificationImg,
  name: 'Bildirimler',
  link: '/notifications'
}, {
  image: cogImg,
  name: 'Ayarlar',
  link: '/settings/account'
}, {
  image: arrowBoxedImg,
  name: 'Çıkış yap',
  link: '/auth/sign-in'
}];
export const settingPanelLinksData = [{
  image: personImg,
  nameKey: 'menu.account',
  link: '/settings/account'
}, 
// {
//   image: notificationImg,
//   nameKey: 'menu.notifications',
//   link: '/settings/notification'
// }, {
//   image: shieldImg,
//   nameKey: 'menu.privacy',
//   link: '/settings/privacy'
// }, {
//   image: handshakeImg,
//   nameKey: 'menu.communication',
//   link: '/settings/communication'
// }, {
//   image: chatAltImg,
//   nameKey: 'menu.messaging',
//   link: '/settings/messaging'
// }, 
{
  image: trashImg,
  nameKey: 'menu.closeAccount',
  link: '/settings/close-account'
}];