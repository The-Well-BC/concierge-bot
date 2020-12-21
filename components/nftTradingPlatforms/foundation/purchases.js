const axios = require('axios');
const fetchNftDetails = require('./fetchNftDetails');


module.exports = function(startTime, limit) {
    let url = 'https://api.thegraph.com/subgraphs/name/f8n/f8n-xdai';

    let marketAction;

    let marketFilterQuery =  `where: { timestamp_gt: ${ startTime } }`;
    let nftFilterQuery =  `where: { placedOn_gt: ${ startTime } }`;

    if(limit && typeof limit === 'number') {
        marketFilterQuery += `, first: ${ limit }`;
        nftFilterQuery += `, first: ${ limit }`;
    }

    const query = `{
        marketActions (${ marketFilterQuery }){
            nft {
                id
                tokenId
                createdBy
                tokenURI
                tokenId
                goLiveDate
                marketListing {
                    listedOn
                }
            }
            brand {
                name
                symbol
            }
            timestamp
            network
            transactionHash
            actionType
            market {
                name
                symbol
                totalSupply
            }
        }
    }`

    return axios.post(url, { query })
    .then(res => {

        console.log('RESS', res.data);
        marketAction = res.data.data.marketActions;

        let counter = 0;

    }).then(res => {
        let counter = 0;

        const fetchNftsForMarketActions = function() {
            if(counter == marketAction.length) 
                return;

            let nft = marketAction[counter].nft;

            if(!nft || nft == null) {
                counter++;
                return fetchNftsForMarketActions();
            }

            return fetchNftDetails(nft)
            .then(res => {
                nft.name = res.name;
                nft.image = res.image;
                counter++;
                return fetchNftsForMarketActions();
            });
        }

        return fetchNftsForMarketActions();
    }).then(res => {

        return marketAction.map( item => {
            let type = (item.nft) ? 'nft' : 'xyk';

            let tokensLeft = null;

            const showcase = item.nft || item.market;
            if(item.market) {
                showcase.price = showcase.totalBuyPrice
                tokensLeft = item.market.totalSupply;
            } else if(item.nft) {
                showcase.price = showcase.minBidNow
            }

            const brand = item.brand;
            item.date = item.timestamp;

            let { tokenAmount } = item;

            if(tokenAmount >= 1000000000000000000)
                tokenAmount = tokenAmount / 1000000000000000000;

            return {
                price: '$' + (showcase.price / 1000000000000000000).toFixed(2),
                name: showcase.name,
                date: new Date(item.date * 1000),
                service: 'foundation',
                brand: brand.name,
                action: item.actionType,
                tokenAmount: tokenAmount,
                tokensLeft,
                buyerWalletUri: `https://blockscout.com/poa/xdai/address/${ item.gateway }/transactions`,
                transactionUri: `https://blockscout.com/poa/xdai/tx/${ item.transactionHash }/token-transfers`,
                img: null
            }
        });
    });
}
