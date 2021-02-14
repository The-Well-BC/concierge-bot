const axios = require('axios');
const fetchHistoricalTicks = require('./fetchHistoricalTicks');

module.exports = function(startTime, limit) {
    let products;

    let max = limit;

    const url = 'https://api.thegraph.com/subgraphs/name/ourzora/zora-v1';
    const query = `{
        drops: medias(where:{createdAtTimestamp_gte: ${ parseInt(startTime / 1000) }}, first: ${max}) {
            id
            owner {
                id
            }
            creator {
                id
            }
            contentURI
            metadataURI
            date: createdAtTimestamp
        }
    }`

    return axios.post(url, { query })
    .then( res => {
        if(res.data && res.data.errors)
            throw res.data.errors;
        products = res.data.data.drops;

        return Promise.all(products.map(p => {
            p.type = 'drop';
            p.date *= 1000;

            return axios.get(p.metadataURI)
            .then(res => {
                res = res.data;
                p.name = res.name;

                return axios.get(`https://zora.co/_next/data/7eBPLEIZdEQZFfPiy9p4e/${p.creator.id}.json`);
            }).then(res => {
                res = res.data.pageProps;

                p.creator.name = res.user.name;
                p.creator.url = res.seo.url;

                return p;
            });
        }));
    }).catch(e => {
        console.error('ERRRO', e);
        throw e;
    });
}
