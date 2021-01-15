let drops = require('./drops');
let purchases = require('./purchases');
const bids = require('./bids');

module.exports = {
    fetchEvents: (startTime, limit) => {
        let events = [];
        let number = parseInt(limit/2);
        return drops(startTime, number)
        .then(res => {
            events = res
            return purchases(startTime, number);
        })
        .then(res => {
            events.push(...res);
            return events;
        });
    }
}

