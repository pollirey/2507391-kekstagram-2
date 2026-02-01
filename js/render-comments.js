const COUNT_STEP = 5;
let currentCount = 0;
let comments = [];

const bigPictureNode = document.querySelector('.big-picture');
const socialCommentsNode = bigPictureNode.querySelector('.social__comments');
const commentCountNode = bigPictureNode.querySelector('.social__comment-count');
const commentsLoaderNode = bigPictureNode.querySelector('.comments-loader');
const socialCommentTemplate = socialCommentsNode.querySelector('.social__comment');

const renderNextComments = () => {
  socialCommentsNode.innerHTML = '';

  const renderedCommentsLength = Math.min(currentCount + COUNT_STEP, comments.length);

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < renderedCommentsLength; i++) {
    const comment = comments[i];
    const commentElement = socialCommentTemplate.cloneNode(true);

    const avatar = commentElement.querySelector('.social__picture');
    avatar.src = comment.avatar;
    avatar.alt = comment.name;

    const text = commentElement.querySelector('.social__text');
    text.textContent = comment.message;

    fragment.appendChild(commentElement);
  }

  socialCommentsNode.appendChild(fragment);

  const shownCount = commentCountNode.querySelector('.social__comment-shown-count');
  const totalCount = commentCountNode.querySelector('.social__comment-total-count');

  if (shownCount) {
    shownCount.textContent = renderedCommentsLength;
  }
  if (totalCount) {
    totalCount.textContent = comments.length;
  }

  commentCountNode.classList.remove('hidden');
  if (renderedCommentsLength >= comments.length) {
    commentsLoaderNode.classList.add('hidden');
  } else {
    commentsLoaderNode.classList.remove('hidden');
  }

  currentCount = renderedCommentsLength;
};

const onCommentsLoaderClick = () => {
  renderNextComments();
};

const clearComments = () => {
  currentCount = 0;
  socialCommentsNode.innerHTML = '';
  commentCountNode.classList.add('hidden');
  commentsLoaderNode.classList.add('hidden');
  commentsLoaderNode.removeEventListener('click', onCommentsLoaderClick);
};

const renderComments = (currentPhotoComments) => {
  comments = currentPhotoComments || [];
  clearComments();

  if (comments.length > 0) {
    renderNextComments();
    commentsLoaderNode.addEventListener('click', onCommentsLoaderClick);
  }
};

export { clearComments, renderComments };
