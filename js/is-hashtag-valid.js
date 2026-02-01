const MAX_HASHTAGS = 5;
const MAX_SYMBOLS = 20;

let errorMessage = '';
const getErrorMessage = () => errorMessage;

const isHashtagValid = (value) => {
  errorMessage = '';

  const inputText = value.toLowerCase().trim();

  if ((inputText.length === 0)) {
    return true;
  }

  const hashtags = inputText.split(/\s+/);

  const rules = [
    {
      check: hashtags.some((item) => item === '#'),
      error: 'Хэштег не может состоять только из решетки'
    },
    {
      check: hashtags.some((item) => item.slice(1).includes('#')),
      error: 'Хэштеги разделяются пробелами'
    },
    {
      check: hashtags.some((item) => item[0] !== '#'),
      error: 'Хэштег должен начинаться с символа #'
    },
    {
      check: hashtags.some((item, num, allHashtags) => allHashtags.includes(item, num + 1)),
      error: 'Хэштеги не должны повторяться'
    },
    {
      check: hashtags.some((item) => item.length > MAX_SYMBOLS),
      error: `Максимальная длина одного хэштега ${MAX_SYMBOLS} символов, включая решетку`
    },
    {
      check: hashtags.length > MAX_HASHTAGS,
      error: `Нельзя указывать больше ${MAX_HASHTAGS} хэштегов`
    },
    {
      check: hashtags.some((item) => !/^#[a-zа-яё0-9]{1,19}$/i.test(item)),
      error: 'Хэштег содержит недопустимые символы'
    }
  ];

  return rules.every((rule) => {
    const isError = rule.check;
    if (isError) {
      errorMessage = rule.error;
    }
    return !isError;
  });
};

export { isHashtagValid, getErrorMessage };
