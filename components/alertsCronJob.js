module.exports = () => {
    const cron = require('node-cron')
    const alertsModel = require('./alerts.model');

    console.log('CRON JOB', process.env.NODE_ENV);

    if(process.env.NODE_ENV !== 'test') {
        // Ten Minutes
        cron.schedule('*/10 * * * *', function() {
            console.log('SENDING ALERTS');
            return alertsModel.sendAlerts('10 min')
        });

        // Daily
        cron.schedule('0 0 * * *', function() {
            console.log('SENDING ALERTS');
            return alertsModel.sendAlerts('1 day')
        });
    }
}
