import { openBigPicture } from './full-size.js';
import { debounce } from './util.js';

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const imgFiltersContainer = document.querySelector('.img-filters');

let allPictures = [];

const clearPictures = () => {
  const pictures = picturesContainer.querySelectorAll('.picture');
  pictures.forEach((picture) => {
    picture.remove();
  });
};

const renderFilteredPictures = (pictures) => {
  const fragment = document.createDocumentFragment();
  pictures.forEach((photoData) => {
    const pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = photoData.url;
    pictureElement.querySelector('.picture__img').alt = photoData.description;
    pictureElement.querySelector('.picture__likes').textContent = photoData.likes;
    pictureElement.querySelector('.picture__comments').textContent = photoData.comments.length;
    pictureElement.addEventListener('click', () => {
      openBigPicture(photoData);
    });
    fragment.appendChild(pictureElement);
  });
  picturesContainer.appendChild(fragment);
};

const applyFilter = (filterType) => {
  let filteredPictures;
  switch (filterType) {
    case 'random':
      filteredPictures = [...allPictures]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
      break;
    case 'discussed':
      filteredPictures = [...allPictures]
        .sort((a, b) => b.comments.length - a.comments.length);
      break;
    case 'default':
    default:
      filteredPictures = allPictures;
  }
  clearPictures();
  renderFilteredPictures(filteredPictures);
};

const initFilters = () => {
  if (!imgFiltersContainer) {
    return;
  }
  imgFiltersContainer.classList.remove('img-filters__inactive');
  const filterButtons = imgFiltersContainer.querySelectorAll('.img-filters__button');
  const debouncedApplyFilter = debounce(applyFilter, 500);
  imgFiltersContainer.addEventListener('click', (evt) => {
    const button = evt.target;
    if (!button.matches('.img-filters__button')) {
      return;
    }
    if (button.classList.contains('img-filters__button--active')) {
      return;
    }
    filterButtons.forEach((btn) => {
      btn.classList.remove('img-filters__button--active');
    });
    button.classList.add('img-filters__button--active');
    const filterType = button.id.replace('filter-', '');
    debouncedApplyFilter(filterType);
  });
};

export const renderPictures = (data) => {
  allPictures = data;
  const picturesListFragment = document.createDocumentFragment();
  data.forEach((photoData) => {
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
  initFilters();
};

