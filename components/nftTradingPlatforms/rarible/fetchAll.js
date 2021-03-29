const axios = require('axios');
const dropFormatter = require('./format.drops');
const saleFormatter = require('./format.sales');
const bidFormatter = require('./format.bids');

module.exports = function(startTime, limit = 10, creators) {
    const url = "https://api.thegraph.com/subgraphs/name/wighawag/eip721-subgraph";
    let max = limit;
    let oldestDate = parseInt(startTime / 1000);
    let creatorStr = creators.join('","');

    let query = `{
        tokenContracts(where: {name: "Rarible"}) {
            tokens(where: {owner_in: ["${ creatorStr }"], mintTime_gte: ${ oldestDate }}, first: ${max}) {
                id
                tokenURI
                created: mintTime
                creator: owner {
                    address: id
                }
            }
        }
    }`;

    return axios.post(url, { query })
    .then(res => {
        res = res.data.data;
        let drops = res.tokenContracts.map(i => i.tokens).flat();
        return Promise.all(drops.map( i => {
            return axios.get(i.tokenURI)
            .then(r2 => {
                r2 = r2.data;

                i.event = 'drop';
                i.name = r2.name;
                i.image = r2.image;

                if(r2.external_url)
                    i.url = r2.external_url;
                /*
                else
                    i.url = `https://app.rarible.com/token/${i.contractAddr}:${tokenId}`;
                */

                i.creator.wallet = {
                    address: i.creator.address
                }

                return i;
            });
        }))
    }).then(res => {
        return res.map(item => {
            let buyer, seller, price, transaction = {};
            let payload;

            switch(item.event) {
                case 'drop':
                    payload = dropFormatter(item);
                    break;
                case 'sale':
                case 'ACCEPT_BID':
                    payload = saleFormatter(item);
                    break;
                case 'BID':
                case 'AUCTION_BID':
                    payload = bidFormatter(item);
                    break;
                default:
                    payload = {}
                    break;
            }

            payload.url = item.url;
            payload.platform = 'rarible';
            payload.name = item.name;

            return payload;
        });
    });
}
