const axios = require('axios');
const fetchHistoricalTicks = require('./fetchHistoricalTicks');

module.exports = function(startTime, limit) {
    let products;

    const url = 'https://api.ourzora.com/graphql';
    const query = `{
        products {
            name 
            slug
            title
            featuredImage { mediaURL }
            organisation { name slug }
            variants {
                token {
                    name
                    latestPrice
                    address
                }
            }
            releaseDate
        }
    }`

    return axios.post(url, { query })
    .then( res => {
        products = res.data.data.products;

        return Promise.all(products.map(p => {
            let token = p.variants[0].token;

            p.type = 'drop';
            p.date = p.releaseDate;

            return fetchHistoricalTicks(token, startTime)
            .then(tick => {
                if(tick == null) {
                    return false;
                } else {
                    p.latestPrice = tick.latest;

                    return p;
                }
            });
        }));
    }).catch(e => {
        console.error('ERRRO');
        throw e;
    });
}
