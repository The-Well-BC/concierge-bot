const axios = require('axios');
const fetchHistoricalTicks = require('./fetchHistoricalTicks');

module.exports = function(startTime, limit) {
    let products, bids;

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

        inactiveBids {
            id
            currency {
                symbol id name decimals
            }
            amount
            date: createdAtTimestamp
            bidder {
                id
            }
            media {
                id
                contentURI
                metadataURI
            }
            type
        }
    }`

    return axios.post(url, { query })
    .then( res => {
        if(res.data && res.data.errors)
            throw res.data.errors;
        products = res.data.data.drops;

        bids = res.data.data.bids;

        // Set event type
        let events = Object.keys(res.data.data).map(key => {
            let p = res.data.data[key];

            if(key == 'drops') {
                return p.map(i => {
                    i.event = 'drop';

                    return i;
                });
            } else if (key == 'inactiveBids') {
                return p.map(i => {
                    if(i.type == 'Finalized')
                        i.event = 'sale';

                    return i;
                });
            }
        }).flat();

        // console.log('EVENTS', events);

        return Promise.all(events.map(p => {
            let nft = (p.event == 'drop') ? p :
                (p.media) ? p.media : null;

            p.date *= 1000;

            if(p.amount && p.currency) {
                p.amount = p.amount / (10 ** p.currency.decimals);
                p.amount += ' ' + p.currency.symbol;
            }

            if(nft) {
                return axios.get(nft.metadataURI)
                .then(res => {
                    res = res.data;
                    nft.name = res.name;

                    if(nft.creator) {
                        return axios.get(`https://zora.co/_next/data/7eBPLEIZdEQZFfPiy9p4e/${nft.creator.id}.json`)
                        .then(res => {

                            res = res.data.pageProps;

                            nft.creator.name = res.user.name;
                            nft.creator.url = res.seo.url;

                            return p;
                        });
                    }

                    return p;
                });
            } else
                return Promise.resolve(p);
        }));
    }).catch(e => {
        console.error('ERRRO', e);
        throw e;
    });
}
