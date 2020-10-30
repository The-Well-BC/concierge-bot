const app = require('express')();
const bot = require('./components/bot');

const bodyParser = require('body-parser');

//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const database = require('postgresorm');
const config = require('./config');
database.initializeDatabase(config.database.connection)

const cron = require('node-cron')
const alertsModel = require('./components/alerts.model');
cron.schedule('0 */3 * * *', function() {
    console.log('SENDING ALERTS');
    return alertsModel.sendAlerts()
});

const links = require('./config/links');

app.post(links.webhook, function(req, res) {
    return bot.receiveMessage(req.body)
    .then(result => {
        return res.send(result);
    });
});

module.exports = app;
