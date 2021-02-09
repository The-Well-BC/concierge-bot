let purchases = require('./purchases');

module.exports = {
    fetchEvents: (startTime, limit) => {
        let events = [];
        return purchases(startTime, limit)
        .then(res => {
            events = res
            return events
            .filter(item => {
                return new Date(item.date) >= startTime;
            });
        });
    }
}
