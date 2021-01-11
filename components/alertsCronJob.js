module.exports = () => {
    const cron = require('node-cron')
    const alertsModel = require('./alerts.model');

    if(process.env.NODE_ENV !== 'test') {
        // Ten Minutes
        cron.schedule('*/10 * * * *', function() {
            console.log('SENDING ALERTS');
            return alertsModel.sendAlerts('1 day')
        });

        // Daily
        cron.schedule('0 0 * * *', function() {
            console.log('SENDING ALERTS');
            return alertsModel.sendAlerts('1 day')
        });
    }
}
