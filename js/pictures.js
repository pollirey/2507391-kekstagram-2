
import { openBigPicture } from './full-size.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const picturesListFragment = document.createDocumentFragment();

export const renderPictures = (data) => {
  data.forEach ((photoData) => {
    const pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = photoData.url;
    pictureElement.querySelector('.picture__img').alt = photoData.description;
    pictureElement.querySelector('.picture__likes').textContent = photoData.likes;
    pictureElement.querySelector('.picture__comments').textContent = photoData.comments.length;

    pictureElement.addEventListener('click', () => {
      openBigPicture(photoData);
    });

    picturesListFragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(picturesListFragment);
};
