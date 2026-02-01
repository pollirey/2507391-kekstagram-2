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
  const button = messageContainer.querySelector('button');
  document.body.appendChild(messageContainer);

  function closeNotification(evt) {
    evt.stopPropagation();
    const inner = messageContainer.querySelector(`.${elem}__inner`);
    const innerTitle = messageContainer.querySelector(`.${elem}__title`);

    if (![inner, innerTitle].includes(evt.target)) {
      messageContainer.remove();
      document.body.classList.remove('modal-open');
      body.removeEventListener('click', onCloseNotification);
    }
  }

  function onCloseNotification (evt) {
    return closeNotification(evt);
  }

  function onCloseNotificationKeydown (evt) {
    if (isEscapeKey(evt)) {
      closeNotification(evt);
      body.removeEventListener('keydown', onCloseNotificationKeydown);
      if (elem === KeyMessages.Error) {
        document.addEventListener('keydown', cbKeyDown);
      }
    }
  }

  button.addEventListener('click', onCloseNotification);
  body.addEventListener('keydown', onCloseNotificationKeydown);
  body.addEventListener('click', onCloseNotification);
};

export { showDataError, showNotification };
