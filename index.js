const express = require('express');

const replies = require('./src/replies');

const port = process.env.PORT || 3030;
const app = express();

app.use(express.json());

app.get('*', function (req, res) {
  return res.status(200).send('Start backend!');
});

app.post('/', (req, res) => {
  const { request, session, state } = req.body;
  const sessionState = state && state.session || {};

  const response = session.new
    ? replies.welcome()
    : checkCommand(sessionState, request);

  return res.json({
    response,
    session_state: sessionState,
    version: '1.0'
  });
});

function checkCommand(sessionState, request) {
  if (Object.keys(sessionState).length === 0) return replies.showMenu();

  const { show } = request.payload || '';

  switch(show) {
    case 'menu': return replies.showMenu();
    case 'addition':
    case 'substraction':
    case 'multiplication':
    case 'division':
    default:
    return checkAnswer(sessionState, request.command, show);
  }
}

function checkAnswer(sessionState, command, operation) {
  let question = sessionState.question;

  if (!question || !command) {
    question = generateQuestion(sessionState, operation);
    return replies.firstQuestion(question);
  }

  if (isCorrectAnswer(question, command)) {
    question = generateQuestion(sessionState, operation);
    return replies.correctAnswer(question);
  }

  if (/сдаюсь/i.test(command) || /не знаю/i.test(command)) {
    const correctAnswer = getAnswer(question);
    question = generateQuestion(sessionState, operation);
    return replies.capitulate(correctAnswer, question);
  }

  return replies.incorrectAnswer(question);
}

function isCorrectAnswer(question, command) {
  const matches = command.match(/-?[0-9]+/);
  const correctAnswer = getAnswer(question);
  return matches && Number(matches[0]) === correctAnswer;
}

function generateQuestion(sessionState, operation) {
  const question = {
    number1: Math.ceil(Math.random() * 20),
    number2: Math.ceil(Math.random() * 20),
    operation: operation === undefined ? sessionState.question.operation : operation,
  };
  sessionState.question = question;
  return question;
}

function getAnswer(question) {
  switch(question.operation) {
    case 'substraction': return question.number1 - question.number2;
    case 'multiplication': return question.number1 * question.number2;
    case 'division': return question.number1 / question.number2;
    case 'addition': default: return question.number1 + question.number2;
  }
}

app.listen(port);