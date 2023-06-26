const {app, PORT, HOST} = require('./server');

app.listen(PORT, HOST, () => {
    console.log(`Express server listening on port ${PORT}`);
});