module.exports = () => {
    const cron = require('node-cron')
    const alertsModel = require('./alerts.model');

    // Ten Minutes
    cron.schedule('*/10 * * * *', function() {
        console.log('SENDING ALERTS');
        return alertsModel.sendAlerts(null, '10 min')
    });

    // Daily
    cron.schedule('0 0 * * *', function() {
        console.log('SENDING ALERTS');
        return alertsModel.sendAlerts(null, '1 day')
    });
}
