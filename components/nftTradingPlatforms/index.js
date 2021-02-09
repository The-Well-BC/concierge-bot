const events = require('./fetchEvents');
const fetchCreators = require('./fetchCreators');

module.exports = (startTime ) => {
    if(!startTime)
        throw new Error('Start time is not specified');
    
    return {
        fetchEvents: (limit) => events(startTime, limit),
        fetchCreators: (limit) => fetchCreators(limit)
    }
}
