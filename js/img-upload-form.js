
import { isEscapeKey } from './util.js';
import { isHashtagValid, error } from './is-hashtag-valid.js';
import { resetEditor } from './image-editor.js';
import { sendData } from './api.js';
import { showNotification } from './notification.js';

const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Публикуем...'
};

const imgUploadForm = document.querySelector('.img-upload__form');
const imgUploadInput = imgUploadForm.querySelector('.img-upload__input');
const imgEditor = imgUploadForm.querySelector('.img-upload__overlay');
const imgEditorCancelButton = imgUploadForm.querySelector('.img-upload__cancel');
const inputHashtags = imgUploadForm.querySelector('.text__hashtags');
const inputDescription = imgUploadForm.querySelector('.text__description');
const submitButton = imgUploadForm.querySelector('.img-upload__submit');


const KeyMessages = {
  Success: 'success',
  Error: 'error'
};

const onDocumentKeyDown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    if ([inputHashtags, inputDescription].includes(document.activeElement)) {
      evt.stopPropagation();
    } else {
      closeImgEditor();
    }
  }
};

const onHashtagInput = () => {
  isHashtagValid(inputHashtags.value);
};

const pristine = new Pristine(imgUploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper'
});

const blockSubmitButton = (isDisabled, buttonText) => {
  submitButton.disabled = isDisabled;
  submitButton.textContent = buttonText;
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  if (pristine.validate()) {
    blockSubmitButton(true, SubmitButtonText.SENDING);

    sendData(new FormData(evt.target))
      .then(() => {
        closeImgEditor();
        showNotification(KeyMessages.Success, onDocumentKeyDown);
      })
      .catch(() => {
        document.removeEventListener('keydown', onDocumentKeyDown);
        showNotification(KeyMessages.Error, onDocumentKeyDown);
      })
      .finally(() => {
        blockSubmitButton(false, SubmitButtonText.IDLE);
      });
  }
};

pristine.addValidator(inputHashtags, isHashtagValid, error, 2, false);

pristine.addValidator(inputDescription, (value) => {
  const hasNumber = value.length <= 140 ;
  return hasNumber;
}, 'не более 140 символов');

function openImgEditor() {
  imgEditor.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeyDown);
  imgEditorCancelButton.addEventListener('click', closeImgEditor);
  inputHashtags.addEventListener('change', onHashtagInput);
  imgUploadForm.addEventListener('submit', onFormSubmit);
}

function closeImgEditor() {
  imgEditor.classList.add('hidden');
  document.removeEventListener('keydown', onDocumentKeyDown);
  document.body.classList.remove('modal-open');
  imgEditorCancelButton.removeEventListener('click', closeImgEditor);

  inputHashtags.removeEventListener('change', onHashtagInput);
  imgUploadForm.removeEventListener('submit', onFormSubmit);

  resetEditor();

  pristine.reset();
  imgUploadForm.reset();
}

const renderImgEditor = () => {
  imgUploadInput.addEventListener('change', openImgEditor);
};

export { renderImgEditor };

