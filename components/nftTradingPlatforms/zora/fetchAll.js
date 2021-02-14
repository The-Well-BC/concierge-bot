const axios = require('axios');
const fetchHistoricalTicks = require('./fetchHistoricalTicks');

module.exports = function(startTime, limit) {
    let products, bids;

    let max = parseInt(limit/2);

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

        sales: inactiveBids(where:{createdAtTimestamp_gte: ${ parseInt(startTime / 1000)}, type: Finalized }, first: ${max}) {
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
                creator {
                    id
                }
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
            } else if (key == 'sales') {

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

            if(!nft)
                throw new Error('You need to return an NFT (media) object');

            return axios.get(nft.metadataURI)
            .then(res => {
                res = res.data;
                nft.name = res.name;

                if(!nft.creator)
                    throw new Error('Return NFT creator object');

            // Fetch user Data
                let users = [p.bidder, p.owner, p.buyer];

                users.push(nft.creator);

                users = users.filter(u => u != null && u != undefined);

                return Promise.all(users.map(user => {

                    return axios.get(`https://zora.co/_next/data/7eBPLEIZdEQZFfPiy9p4e/${user.id}.json`)
                    .then(res2 => {
                        userData = res2.data.pageProps;

                        if(userData.user)
                            user.name = userData.user.name || userData.user.username;
                        /*
                        else if(userData.seo)
                            user.name = userData.seo.title
                        */

                        user.url = userData.seo.url;
                    })
                })).then(() => p)
            });
        }));
    }).catch(e => {
        console.error('ERRRO', e);
        throw e;
    });
}
