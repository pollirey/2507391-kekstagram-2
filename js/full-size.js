import { isEscapeKey } from './util.js';
import { renderComments, clearComments } from './render-comments.js';

const bigPictureElement = document.querySelector('.big-picture');
const bigPictureCancelElement = bigPictureElement.querySelector('.big-picture__cancel');
const bigPictureImg = bigPictureElement.querySelector('.big-picture__img img');
const likesCount = bigPictureElement.querySelector('.likes-count');
const socialCaption = bigPictureElement.querySelector('.social__caption');
const socialCommentTotalCount = bigPictureElement.querySelector('.social__comment-total-count');

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
};

function openBigPicture(photoData) {
  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  socialCaption.textContent = photoData.description;

  if (socialCommentTotalCount) {
    socialCommentTotalCount.textContent = photoData.comments.length;
  }

  renderComments(photoData.comments);


  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
}

function closeBigPicture() {

  clearComments();

  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

bigPictureCancelElement.addEventListener('click', () => {
  closeBigPicture();
});

export { openBigPicture };
