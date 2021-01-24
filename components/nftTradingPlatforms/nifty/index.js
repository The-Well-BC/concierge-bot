let drops = require('./drops');
let transactions = require('./transactions');

module.exports = {
    fetchEvents: (startTime, limit) => {
        let events = [];
        let number = parseInt(limit/2);
        return drops(startTime, number)
        .then(res => {
            events = res
            return transactions(startTime, number);
        })
        .then(res => {
            events.push(...res);
            return events;
        });
    }
}

