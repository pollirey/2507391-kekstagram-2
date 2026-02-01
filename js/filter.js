import { renderPictures } from './pictures.js';
import { debounce } from './util.js';

const Filter = {
  DEFAULT: 'default',
  RANDOM: 'random',
  DISCUSSED: 'discussed'
};

const MAX_PICTURE_COUNT = 10;

let currentFilter = Filter.DEFAULT;
let pictures = [];

const filterContainer = document.querySelector('.img-filters');
const filterButtons = filterContainer.querySelectorAll('.img-filters__button');
const activeButtonClass = 'img-filters__button--active';
const debounceRender = debounce(renderPictures, 500);

const applyFilter = () => {
  let filteredPictures = [];

  switch (currentFilter) {
    case Filter.RANDOM:
      filteredPictures = [...pictures]
        .sort(() => Math.random() - 0.5)
        .slice(0, MAX_PICTURE_COUNT);
      break;

    case Filter.DISCUSSED:
      filteredPictures = [...pictures]
        .sort((a, b) => b.comments.length - a.comments.length);
      break;

    case Filter.DEFAULT:
    default:
      filteredPictures = pictures;
      break;
  }

  debounceRender(filteredPictures);
};

const onFilterChange = (evt) => {
  const targetButton = evt.target;

  if (!targetButton.matches('.img-filters__button')) {
    return;
  }

  if (targetButton.classList.contains(activeButtonClass)) {
    return;
  }

  filterButtons.forEach((button) => {
    button.classList.remove(activeButtonClass);
  });

  targetButton.classList.add(activeButtonClass);
  currentFilter = targetButton.id.replace('filter-', '');
  applyFilter();
};

const configureFilter = (picturesData) => {
  filterContainer.classList.remove('img-filters--inactive');
  pictures = picturesData;

  filterContainer.addEventListener('click', onFilterChange);
};

export { configureFilter };
