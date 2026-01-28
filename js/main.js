
import { renderImgEditor } from './img-upload-form.js';

import { getData } from './api';

import { showDataError} from './notification';

import { renderPictures } from './pictures.js';


getData ()
  .then((data) => {
    renderPictures(data);
  })

  .catch(showDataError);


renderImgEditor();


