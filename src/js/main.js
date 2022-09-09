import {
  asd
} from './func.js';
asd();
// import Swiper JS
import Swiper, {
  Navigation,
  Pagination
} from 'swiper';
// import Swiper styles
// import 'swiper/css';

const swiper = new Swiper('.swiper', {
  modules: [Navigation, Pagination],
  // Optional parameters
  loop: true,
  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});