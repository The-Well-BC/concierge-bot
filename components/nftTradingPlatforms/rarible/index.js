let fetchAll = require('./fetchAll');

module.exports = {
    fetchEvents: (startTime, limit, creators) => {
        let events = [];
        return fetchAll(startTime, limit, creators)
        .then(res => {
            events = res
            return events
        });
    }
}
