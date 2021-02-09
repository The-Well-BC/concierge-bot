const ethPrice = require("./ethPrice");

module.exports = () => {
    const cron = require('node-cron')
    const alertsModel = require('./alerts.model');

    if(process.env.NODE_ENV !== 'test') {
        // Ten Minutes
        cron.schedule('*/10 * * * *', function() {
            let now = new Date();
            // To be safe, will subtract 9 minutes incase the cron job runs a little too early. Hopefully this solves the message duplicate error
            let startTime = new Date(new Date().setMinutes(now.getMinutes() - 9));
            let minute = Math.floor(startTime.getMinutes() / 10) * 10;

            startTime.setMinutes(minute,0,0);

            return alertsModel.sendAlerts(startTime)
        });

        // Daily
        cron.schedule('0 0 * * *', function() {
            return ethPrice.updatePrice();
        });
    }
}
