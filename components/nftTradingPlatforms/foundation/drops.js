const axios = require('axios');
const fetchNftDetails = require('./fetchNftDetails');


module.exports = function(startTime, limit) {
    let url = 'https://api.thegraph.com/subgraphs/name/f8n/f8n-xdai';

    let xykmarket;
    let nft721;

    let filterQuery =  `where: { goLiveDate_gt: ${ startTime } }`;

    if(limit && typeof limit === 'number')
        filterQuery += `, first: ${ parseInt(limit/2) }`;

    const query = `{
        nft721S ( ${ filterQuery }) {
            id
            tokenId
            createdBy
            goLiveDate
            brand {
                name
                symbol
            }
        }

        xykmarkets (${ filterQuery }) {
            goLiveDate
            name
            symbol

            brand {
                name
                symbol
            }
        }
    }`

    return axios.post(url, { query })
    .then(res => {
        if(res.data.data.xykmarkets.length < 1
                           ||
           res.data.data.nft721S.length < 1)
            console.debug('RES',res.data);

        xykmarket = res.data.data.xykmarkets;
        nft721 = res.data.data.nft721S;

        let counter = 0;


        const fetchNfts = function() {
            if(counter == nft721.length) 
                return;

            let nft = nft721[counter];
            return fetchNftDetails(nft)
            .then(res => {
                nft.name = res.name;
                nft.image = res.image;
                counter++;
                return fetchNfts();
            });
        }

        return fetchNfts();
    }).then(res => {
        let counter = 0;

        let payload = [ ...xykmarket, ...nft721 ]

        let drops = payload.map( item => {
            const creator = item.brand;
            item.date = item.goLiveDate;

            return {
                name: item.name,
                url: 'https://foundation.app/explore',
                date: new Date(item.date * 1000),
                platform: 'foundation',
                event: 'drop',
                creator,
                img: null
            }
        });

        return drops;
    });
}
