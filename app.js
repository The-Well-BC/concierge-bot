const app = require('express')();
const bot = require('./components/bot');

const bodyParser = require('body-parser');

//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const database = require('postgresorm');
const config = require('./config');
database.initializeDatabase(config.database.connection)

app.post('/webhook/telegram/secret/', function(req, res) {
    return bot.receiveMessage(req.body)
    .then(result => {
        return res.send(result);
    });
});

module.exports = app;
