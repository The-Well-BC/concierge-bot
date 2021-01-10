const fetchCreators = require('../nftTradingPlatforms/fetchCreators');

module.exports = (payload, messenger, formatter, commands) => {

    if(!payload.command.params)
        return Promise.resolve(formatter.browse(messenger, commands));
    else {
        return fetchCreators(3)
        .then(res => {
            return formatter.creatorSummary(res, messenger);
        });
    }
}
