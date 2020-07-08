const micro = require('micro');
const replies = require('./src/replies');

/**
 * @type {{number1: number, number2: number}}
 */
let question;

const server = micro(async (req, res) => {
  if (req.method !== 'POST') {
    return 'Server is running';
  }

  const { request, session } = await micro.json(req);
  const response = session.new
    ? replies.welcome()
    : checkAnswer(request.command);;

  return {
    response,
    version: '1.0'
  };
});

function checkAnswer(command) {
  if (!question) {
    question = generateQuestion();
    return replies.firstQuestion(question);
  }

  if (isCorrectAnswer(command)) {
    question = generateQuestion();
    return replies.correctAnswer(question);
  }

  if (/сдаюсь/i.test(command)) {
    const answer = question.number1 + question.number2;
    question = generateQuestion();
    return replies.capitulate(answer, question);
  }

  return replies.incorrectAnswer(question);
}

function isCorrectAnswer(command) {
  const matches = command.match(/[0-9]+/);
  const correctAnswer = question.number1 + question.number2;
  return matches && Number(matches[0]) === correctAnswer;
}

function generateQuestion() {
  return {
    number1: Math.ceil(Math.random() * 20),
    number2: Math.ceil(Math.random() * 20),
  };
}

const PORT = 3030;
server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}, tunnel: http://localhost:4040`));