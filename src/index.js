const {app, PORT} = require('./server');

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
  });
  