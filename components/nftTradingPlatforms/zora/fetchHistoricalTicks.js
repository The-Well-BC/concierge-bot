const axios = require('axios');

module.exports = (token, time) => {
    const url = 'https://api.ourzora.com/graphql';
    const query = `{
        tokenHistoricalTicks( tokenAddress: "${ token.address }" )  {
            latest
            timestamp
            __typename
        }
    }`

    const variables = { tokenAddress: token.address };

    return axios.post(url, { query } )
    .then( res => {
        let ticks = res.data.data.tokenHistoricalTicks;
        let latestTick = null;
        ticks.forEach(t => {
            if(new Date(t.timestamp) > time ) {
                if(latestTick == null ||
                (new Date(t.timestamp) > latestTick.timestamp) )
                    latestTick = t;

                latestTick.timestamp = new Date(latestTick.timestamp);
            }
        });
        return latestTick;
    }).catch(e => {
        console.log('popm ERRRO');
        if(!e.response.data)
            console.log('EE',e);
        else {
            console.log(e.response.data);
            console.log(e.response.data.errors);
        }
        throw e;
    });
}
