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
  const { show } = request.payload;

  switch(show) {
    case 'menu': return replies.showMenu();
    case 'addition': 
    default:
    return checkAnswer(sessionState, request.command);
  }
}

function checkAnswer(sessionState, command) {
  let question = sessionState.question;

  if (!question) {
    question = generateQuestion(sessionState);
    return replies.firstQuestion(question);
  }

  if (isCorrectAnswer(question, command)) {
    question = generateQuestion(sessionState);
    return replies.correctAnswer(question);
  }

  if (/сдаюсь/i.test(command) || /не знаю/i.test(command)) {
    const answer = question.number1 + question.number2;
    question = generateQuestion(sessionState);
    return replies.capitulate(answer, question);
  }

  return replies.incorrectAnswer(question);
}

function isCorrectAnswer(question, command) {
  const matches = command.match(/[0-9]+/);
  const correctAnswer = question.number1 + question.number2;
  return matches && Number(matches[0]) === correctAnswer;
}

function generateQuestion(sessionState) {
  const question = {
    number1: Math.ceil(Math.random() * 20),
    number2: Math.ceil(Math.random() * 20),
  };
  sessionState.question = question;
  return question;
}

app.listen(port);