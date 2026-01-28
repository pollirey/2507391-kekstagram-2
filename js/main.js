import { renderImgEditor } from './img-upload-form.js';
import { getData } from './api.js';
import { showDataError } from './notification.js';
import { renderPictures } from './pictures.js';

getData()
  .then((data) => {
    renderPictures(data);
  })
  .catch(showDataError);

renderImgEditor();
