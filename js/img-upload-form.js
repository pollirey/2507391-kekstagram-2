import { isEscapeKey, KeyMessages } from './util.js';
import { isHashtagValid, getErrorMessage } from './is-hashtag-valid.js';
import { resetEditor } from './image-editor.js';
import { sendData } from './api.js';
import { showNotification } from './notification.js';

const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Публикуем...'
};

const imgUploadForm = document.querySelector('#upload-select-image');
const imgUploadInput = document.querySelector('#upload-file');
const imgEditor = document.querySelector('.img-upload__overlay');
const imgEditorCancelButton = document.querySelector('#upload-cancel');
const inputHashtags = document.querySelector('.text__hashtags');
const inputDescription = document.querySelector('.text__description');
const submitButton = document.querySelector('.img-upload__submit');
const previewEffects = document.querySelectorAll('.effects__preview');

const handleFileUpload = () => {
  const file = imgUploadInput.files[0];
  if (file) {
    const previewImgUrl = URL.createObjectURL(file);
    const imagePreview = document.querySelector('.img-upload__preview img');
    imagePreview.src = previewImgUrl;
    previewEffects.forEach((effect) => {
      effect.style.backgroundImage = `url(${previewImgUrl})`;
    });
  }
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

pristine.addValidator(inputHashtags, isHashtagValid, getErrorMessage, 2, false);

pristine.addValidator(inputDescription, (value) => {
  const hasNumber = value.length <= 140;
  return hasNumber;
}, 'не более 140 символов');

function openImgEditor() {
  imgEditor.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeyDown);
  imgEditorCancelButton.addEventListener('click', onCloseImgEditor);
  inputHashtags.addEventListener('input', onHashtagInput);
  imgUploadForm.addEventListener('submit', onFormSubmit);

  handleFileUpload();
}

function closeImgEditor() {
  imgEditor.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeyDown);
  imgEditorCancelButton.removeEventListener('click', onCloseImgEditor);
  inputHashtags.removeEventListener('input', onHashtagInput);
  imgUploadForm.removeEventListener('submit', onFormSubmit);

  resetEditor();
  pristine.reset();
  imgUploadForm.reset();
}

function onCloseImgEditor() {
  return closeImgEditor();
}

const onImgUploadInputChange = () => {
  openImgEditor();
};

const renderImgEditor = () => {
  imgUploadInput.addEventListener('change', onImgUploadInputChange);
};

export { renderImgEditor };
