const nftFn = require('../nftTradingPlatforms');

module.exports = (payload, messenger, formatter, commands) => {

    if(!payload.command.params)
        return Promise.resolve(formatter.browse(messenger, commands));
    else {
        return nftFn.fetchCreators()
        .then(res => {
            console.log('RES', res);
        });
    }
}
