/**
 * Приветственное сообщение при входе в навык.
 */
exports.welcome = () => {
  const greeting = getRandomElement(['Привет', 'Здравствуйте', 'Доброе пожаловать!']);
  return {
    text: `${greeting}. Я ваш новый учитель математики. Начинаем урок?`,
    tts: `<speaker audio="alice-music-harp-1.opus">${greeting}. Я ваш новый учитель математики.\nНачинаем урок?`,
    card: {
      type: "BigImage",
      image_id: "1030494/c90774586a5bf8d801f4",
      title: "Математические тренажеры",
      description: "Добро пожаловать в математические тренажеры.\nВы можете выбрать нужный тренажер и начать тренировку!\nУдачной тренировки!🎉",
      button: {
        text: "Начинаем",
        payload: {
          show: 'menu',
        },
      },
    },
    end_session: false
  };
};

exports.showMenu = () => {
  return {
    text: '',
    tts: '',
    card: {
      type: 'ItemsList',
      header: {
        text: 'Доступные тренировки',
      },
      items: [
        {
          image_id: '937455/f302804f29f3c56d4de5',
          title: 'Сложение',
          description: 'Проверь свои навыки в сложении чисел от 1 до 20',
          button: {
            text: 'Сложение',
            payload: {
              show: 'addition',
            }
          },
        },
        {
          image_id: '965417/ec8cf4175fcd2f30d582',
          title: 'Вычитание',
          description: 'Проверь свои навыки в вычитании чисел от 1 до 20',
          button: {
            text: 'Вычитание (в разработке)',
            payload: {
              show: 'substraction',
            }
          },
        },
        {
          image_id: '965417/5d297b22c8b80ec1dc63',
          title: 'Умножение (в разработке)',
          description: 'Проверь свои навыки в умножении чисел от 1 до 20',
          button: {
            text: 'Умножение',
            payload: {
              show: 'multiplication',
            }
          },
        },
        {
          image_id: '965417/2b4255c4a29bcc305f89',
          title: 'Деление',
          description: 'Проверь свои навыки в делении чисел от 1 до 20',
          button: {
            text: 'Деление (в разработке)',
            payload: {
              show: 'division',
            }
          },
        },
      ],
    },
    end_session: false
  };
};

/**
 * Повторяем фразу пользователя.
 *
 * @param {String} command
 */
exports.repeatUserCommand = command => {
  return {
    text: `Вы сказали: ${command}`,
    end_session: false
  };
};

/**
 * Первый вопрос пользователю.
 *
 * @param {Number} number1
 * @param {Number} number2
 */
exports.firstQuestion = ({ number1, number2 }) => {
  return {
    text: `Сколько будет ${number1} + ${number2} = ?`,
    tts: `Сколько будет ${number1} + ${number2}`,
    buttons: [capitulateButton, noIdeaButton],
    end_session: false
  };
};
/**
 * Реакция на неправильный ответ.
 *
 * @param {Number} number1
 * @param {Number} number2
 */
exports.incorrectAnswer = ({ number1, number2 }) => {
  const no = getRandomElement(['Неверно', 'Неправильно', 'Нет']);
  return {
    text: `${no}. Попробуй еще раз: ${number1} + ${number2} = ?`,
    tts: `${no}. Попробуй еще раз: ${number1} + ${number2}`,
    buttons: [capitulateButton, noIdeaButton],
    end_session: false
  };
};

/**
 * Реакция на правильный ответ.
 *
 * @param {Number} number1
 * @param {Number} number2
 */
exports.correctAnswer = ({ number1, number2 }) => {
  const yes = getRandomElement(['Правильно', 'Отлично', 'Да']);
  return {
    text: `${yes}! Следующий вопрос: ${number1} + ${number2} = ?`,
    tts: `<speaker audio="alice-sounds-human-crowd-6.opus">${yes}! Следующий вопрос: ${number1} + ${number2}`,
    buttons: [capitulateButton, noIdeaButton],
    end_session: false
  };
};

/**
 * Реакция на "сдаюсь".
 *
 * @param {Number} answer
 * @param {Number} number1
 * @param {Number} number2
 */
exports.capitulate = (answer, { number1, number2 }) => {
  return {
    text: `Правильный ответ ${answer}. Задам другой пример: ${number1} + ${number2} = ?`,
    tts: `<speaker audio="alice-sounds-game-loss-3.opus">Правильный ответ ${answer}. Задам другой пример: ${number1} + ${number2}`,
    buttons: [capitulateButton, noIdeaButton],
    end_session: false
  };
};

const capitulateButton = {
  title: 'Сдаюсь', hide: true
};

const noIdeaButton = {
  title: 'Не знаю', hide: true
};

function getRandomElement(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}