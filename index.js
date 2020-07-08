const micro = require('micro');
const replies = require('./src/replies');

const server = micro(async (req, res) => {
  if (req.method !== 'POST') {
    return 'Server is running';
  }

  const { request, session } = await micro.json(req);
  const response = session.new
    ? replies.welcome()
    : replies.repeatUserCommand(request.command);

  return {
    response,
    version: '1.0'
  };
});

const PORT = 3030;
server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}, tunnel: http://localhost:4040`));