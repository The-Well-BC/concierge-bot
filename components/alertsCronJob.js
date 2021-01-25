const ethPrice = require("./ethPrice");

module.exports = () => {
    const cron = require('node-cron')
    const alertsModel = require('./alerts.model');

    if(process.env.NODE_ENV !== 'test') {
        // Ten Minutes
        cron.schedule('*/10 * * * *', function() {
            return alertsModel.sendAlerts('10 min')
        });

        // Daily
        cron.schedule('0 0 * * *', function() {
            return ethPrice.updatePrice();
        });
    }
}
