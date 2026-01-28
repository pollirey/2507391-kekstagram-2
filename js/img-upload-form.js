import { isEscapeKey, KeyMessages } from './util.js';
import { isHashtagValid, error } from './is-hashtag-valid.js';
import { resetEditor } from './image-editor.js';
import { sendData } from './api.js';
import { showNotification } from './notification.js';

const imagePreview = document.querySelector('.img-upload__preview img');

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
const submitButton = document.querySelector('#upload-submit');

const handleFileUpload = (evt) => {
  const file = evt.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      imagePreview.src = e.target.result;
    };

    reader.onerror = () => {
    };

    reader.readAsDataURL(file);
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

pristine.addValidator(inputHashtags, isHashtagValid, error, 2, false);

pristine.addValidator(inputDescription, (value) => {
  const hasNumber = value.length <= 140;
  return hasNumber;
}, 'не более 140 символов');

function openImgEditor(evt) {
  if (evt && evt.target.files && evt.target.files[0]) {
    handleFileUpload(evt);
  }

  imgEditor.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeyDown);

  imgUploadInput.addEventListener('change', handleFileUpload);

  imgEditorCancelButton.addEventListener('click', closeImgEditor);
  inputHashtags.addEventListener('change', onHashtagInput);
  imgUploadForm.addEventListener('submit', onFormSubmit);
}

function closeImgEditor() {
  imgEditor.classList.add('hidden');
  document.removeEventListener('keydown', onDocumentKeyDown);
  document.body.classList.remove('modal-open');

  imgUploadInput.removeEventListener('change', handleFileUpload);
  imgEditorCancelButton.removeEventListener('click', closeImgEditor);
  inputHashtags.removeEventListener('change', onHashtagInput);
  imgUploadForm.removeEventListener('submit', onFormSubmit);

  resetEditor();

  pristine.reset();
  imgUploadForm.reset();

  imgUploadInput.value = '';
}

const renderImgEditor = () => {
  imgUploadInput.addEventListener('change', openImgEditor);
};

export { renderImgEditor };
