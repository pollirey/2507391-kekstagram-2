import { isEscapeKey, KeyMessages } from './util.js';

const ALERT_SHOW_TIME = 5000;
const body = document.body;

const showDataError = () => {
  const dataErrorTemplate = document.querySelector('#data-error').content.querySelector('.data-error');
  const dataErrorContainer = dataErrorTemplate.cloneNode(true);
  document.body.appendChild(dataErrorContainer);

  setTimeout(() => {
    dataErrorContainer.remove();
  }, ALERT_SHOW_TIME);
};

const showNotification = (elem, cbKeyDown) => {
  const messageTemplate = document.querySelector(`#${elem}`).content.querySelector(`.${elem}`);
  const messageContainer = messageTemplate.cloneNode(true);
  const button = messageContainer.querySelector('.button');
  document.body.appendChild(messageContainer);

  function closeNotification(evt) {
    evt.stopPropagation();
    const inner = messageContainer.querySelector(`.${elem}__inner`);
    const innerTitle = messageContainer.querySelector(`.${elem}__title`);

    if (
      (evt.target !== inner && evt.target !== innerTitle) ||
      evt.target === button ||
      isEscapeKey(evt)
    ) {
      messageContainer.remove();
      document.body.classList.remove('modal-open');
      body.removeEventListener('keydown', closeNotification);
      body.removeEventListener('click', closeNotification);

      if (elem === KeyMessages.Error) {
        document.addEventListener('keydown', cbKeyDown);
      }
    }
  }

  button.addEventListener('click', closeNotification);
  body.addEventListener('keydown', closeNotification);
  body.addEventListener('click', closeNotification);
};

export { showDataError, showNotification };
