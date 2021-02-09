const events = require('./fetchEvents');
const fetchCreators = require('./fetchCreators');

module.exports = (startTime ) => {
    if(!startTime)
        throw new Error('Start time is not specified');
    console.log('START TIME', new Date(startTime).toISOString());
    
    return {
        fetchEvents: (limit) => events(startTime, limit),
        fetchCreators: (limit) => fetchCreators(limit)
    }
}
