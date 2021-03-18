const axios = require('axios');
const dropFormatter = require('./format.drops');
const saleFormatter = require('./format.sales');
const bidFormatter = require('./format.bids');

module.exports = function(startTime, limit = 10, creators) {
    const url = "https://api.thegraph.com/subgraphs/name/protofire/superrare";
    let max = limit;
    let oldestDate = parseInt(startTime / 1000);
    let creatorStr = creators.join('","');

    let query = `{
        drops: artworks (where: {creator_in: ["${ creatorStr }"], created_gte: ${ oldestDate }}, first: ${max}) {
            tokenId
            descriptorUri
            name
            createdBy
            created
            creator {
                id
                address
            }
            version
        }
    }`;

    return axios.post(url, { query })
    .then(res => {
        res = res.data.data;
        return Promise.all(res.drops.map( i => {
            return axios.get(i.descriptorUri)
            .then(r2 => {
                r2 = r2.data;

                i.event = 'drop';
                i.name = r2.name;
                i.creator.name = r2.createdBy;
                i.creator.wallet = {
                    address: i.creator.address
                }

                return i;
            });
        }))
    }).then(res => {
        return res.map(item => {
            let urlNFT = (item.version == 'V1') ? 'https://superrare.co/artwork' : 'https://superrare.co/artwork-v2';
            urlNFT += `/${ item.name.toLowerCase().replace(/\s/g, '-').replace(/[^\da-z]/g, '') }-${ item.tokenId }`;


            urlNFT = urlNFT.toLowerCase();

            // let creatorUrl = `https://superrare.co/${ item.creator.username }`
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

            payload.url = urlNFT;
            payload.name = item.name;

            return payload;
        });
    });
}
