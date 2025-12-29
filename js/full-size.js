import { isEscapeKey } from './util.js';

const bigPictureElement = document.querySelector('.big-picture');
const bigPictureCancelElement = bigPictureElement.querySelector('.big-picture__cancel');
const bigPictureImg = bigPictureElement.querySelector('.big-picture__img img');
const likesCount = bigPictureElement.querySelector('.likes-count');
const socialCaption = bigPictureElement.querySelector('.social__caption');
const socialCommentTotalCount = bigPictureElement.querySelector('.social__comment-total-count');
const socialComments = bigPictureElement.querySelector('.social__comments');
const socialCommentCount = bigPictureElement.querySelector('.social__comment-count');
const commentsLoader = bigPictureElement.querySelector('.comments-loader');

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
  socialCommentTotalCount.textContent = photoData.comments.length;

  socialComments.innerHTML = '';
  photoData.comments.forEach((comment) => {
    const commentElement = document.createElement('li');
    commentElement.classList.add('social__comment');

    const avatarImg = document.createElement('img');
    avatarImg.classList.add('social__picture');
    avatarImg.src = comment.avatar;
    avatarImg.alt = comment.name;
    avatarImg.width = 35;
    avatarImg.height = 35;

    const textElement = document.createElement('p');
    textElement.classList.add('social__text');
    textElement.textContent = comment.message;

    commentElement.appendChild(avatarImg);
    commentElement.appendChild(textElement);
    socialComments.appendChild(commentElement);
  });

  socialCommentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
}

function closeBigPicture() {
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

bigPictureCancelElement.addEventListener('click', () => {
  closeBigPicture();
});

export { openBigPicture };