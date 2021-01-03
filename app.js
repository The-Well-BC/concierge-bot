const app = require('express')();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const ctrl = require('./components/controller');

const config = require('./config');
const database = require('postgresorm');
database.initializeDatabase(config.database.connection)

require('./components/alertsCronJob')();

const links = require('./config/links');

app.post(links.telegramWebhook, ctrl.receiveBotMessage);

module.exports = app;
