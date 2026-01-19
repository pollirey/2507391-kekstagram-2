

let currentScale = 100;
const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const scaleControlValue = document.querySelector('.scale__control--value');
const imagePreview = document.querySelector('.img-upload__preview img');

const updateScale = (value) => {
  currentScale = value;
  scaleControlValue.value = `${currentScale}%`;
  const scaleValue = currentScale / 100;
  imagePreview.style.transform = `scale(${scaleValue})`;
};

const initScale = () => {
  updateScale(SCALE_DEFAULT);

  scaleControlSmaller.addEventListener('click', () => {
    let newValue = currentScale - SCALE_STEP;
    if (newValue < SCALE_MIN) {
      newValue = SCALE_MIN;
    }
    updateScale(newValue);
  });

  scaleControlBigger.addEventListener('click', () => {
    let newValue = currentScale + SCALE_STEP;
    if (newValue > SCALE_MAX) {
      newValue = SCALE_MAX;
    }
    updateScale(newValue);
  });
};


const effectsList = document.querySelector('.effects__list');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');

const EFFECTS = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    filter: '',
    unit: ''
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    filter: 'grayscale',
    unit: ''
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    filter: 'sepia',
    unit: ''
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    filter: 'invert',
    unit: '%'
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    filter: 'blur',
    unit: 'px'
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    filter: 'brightness',
    unit: ''
  }
};

let currentEffect = 'none';

const initSlider = () => {
  if (!effectLevelSlider || !window.noUiSlider) {
    return;
  }

  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 1,
    connect: 'lower'
  });

  effectLevelContainer.classList.add('hidden');

  effectLevelSlider.noUiSlider.on('update', () => {
    const value = effectLevelSlider.noUiSlider.get();
    const effect = EFFECTS[currentEffect];

    effectLevelValue.value = value;

    if (currentEffect === 'none') {
      imagePreview.style.filter = '';
    } else {
      imagePreview.style.filter = `${effect.filter}(${value}${effect.unit})`;
    }
  });
};

const initEffects = () => {
  if (effectsList) {
    effectsList.addEventListener('change', (evt) => {
      if (evt.target.type === 'radio') {
        currentEffect = evt.target.value;
        const effect = EFFECTS[currentEffect];

        if (effectLevelSlider && effectLevelSlider.noUiSlider) {
          effectLevelSlider.noUiSlider.updateOptions({
            range: {
              min: effect.min,
              max: effect.max
            },
            start: effect.max,
            step: effect.step
          });

          if (currentEffect === 'none') {
            effectLevelContainer.classList.add('hidden');
            imagePreview.style.filter = '';
            effectLevelValue.value = '';
          } else {
            effectLevelContainer.classList.remove('hidden');
            effectLevelValue.value = effect.max;
          }
        }
      }
    });
  }
};

const resetEditor = () => {
  updateScale(SCALE_DEFAULT);

  currentEffect = 'none';

  if (effectLevelSlider && effectLevelSlider.noUiSlider) {
    effectLevelSlider.noUiSlider.updateOptions({
      range: {
        min: 0,
        max: 100
      },
      start: 100,
      step: 1
    });
  }

  if (effectLevelContainer) {
    effectLevelContainer.classList.add('hidden');
  }

  if (imagePreview) {
    imagePreview.style.filter = '';
  }

  if (effectLevelValue) {
    effectLevelValue.value = '';
  }

  const originalEffect = document.querySelector('#effect-none');
  if (originalEffect) {
    originalEffect.checked = true;
  }
};

const initImageEditor = () => {
  initScale();
  if (typeof noUiSlider !== 'undefined') {
    initSlider();
    initEffects();
  }
};

export { initImageEditor, resetEditor };
