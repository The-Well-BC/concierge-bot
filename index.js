const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3083;

app.set('port', port);
let server = http.createServer(app);

server.listen(port);
server.timeout = 500000;

module.exports = server;
