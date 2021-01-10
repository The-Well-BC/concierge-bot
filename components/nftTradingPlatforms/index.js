const drops = require('./fetchDrops');
const purchases = require('./fetchTransactions');
const fetchCreators = require('./fetchCreators');

module.exports = (frequency) => {
    const now = new Date();
    let freqAmount = frequency.split(' ')[0];
    let startTime;

    switch(frequency.split(' ')[1]) {
        case 'day':
        case 'days':
            startTime = new Date().setDate(now.getDate() - freqAmount);
            break;
        case 'min':
        case 'minutes':
        case 'mins':
            startTime = new Date().setMinutes(now.getMinutes() - freqAmount);
            break;
        case 'month':
        case 'months':
            startTime = new Date().setMonth(now.getMonth() - freqAmount);
            break;
        default:
            startTime = new Date().setMinutes(now.getMinutes() - 10);
            break;
    }
    
    return {
        fetchDrops: (limit) => drops(startTime, limit),
        fetchPurchases: (limit) => purchases(startTime, limit),
        fetchCreators: (limit) => fetchCreators(limit)
    }
}
