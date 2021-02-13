const axios = require('axios');
const fetchNftDetails = require('./fetchNftDetails');

module.exports = function(startTime, limit) {
    let url = 'https://api.thegraph.com/subgraphs/name/f8n/f8n-xdai';

    let date = parseInt(startTime / 1000);

    let drops, bids, sales;

    let additionalQuery =  ``;

    if(limit && typeof limit === 'number') {
        if(limit < 4)
            limit = 4;
         additionalQuery += `, first: ${ parseInt(limit/4) }`;
    }

    const query = `{
        drops: nft721S ( where: { goLiveDate_gt: ${ date }} ${ additionalQuery }) {
            id
            tokenId
            goLiveDate
            brand {
                name
                symbol
            }
        }

        drops2: xykmarkets (where: { goLiveDate_gt: ${ date }} ${ additionalQuery }) {
            goLiveDate
            name
            symbol

            brand {
                name
                symbol
            }
        }

        transactions: marketActions (where: { timestamp_gt: ${ date }} ${ additionalQuery }){
            nft {
                id
                tokenId
                createdBy
                tokenId
                goLiveDate
                minBidPrice
                marketListing {
                    listedOn
                }
            }
            brand {
                name
                symbol
            }
            timestamp
            gateway
            network
            tokenAmount
            transactionHash
            actionType
            market {
                name
                symbol
                totalSupply
                totalBuyPrice
            }
        }

        bids: nftmarketBids(where: { placedOn_gt: ${ date }} ${ additionalQuery }) {
            value
            status
            placedOn
            nft {
                id
                tokenId
                createdBy
                tokenURI
                tokenId
                goLiveDate
                minBidPrice
                marketListing {
                    listedOn
                }
                brand {
                    name
                    symbol
                }

                nft721Base {
                    name
                    symbol
                }
            }
        }
    }`;

    return axios.post(url, { query })
    .then(res => {

        drops = [...res.data.data.drops, ...res.data.data.drops2];
        transactions = res.data.data.transactions;
        transactions = res.data.data.marketActions;

        let counter = 0;

        let promises = Object.keys(res.data.data).map(key => {
            return res.data.data[key].map(item => {
                if(item.actionType)
                    item.nftEventType = item.actionType;
                else if(item.goLiveDate)
                    item.nftEventType = 'drop';

                // console.log('NFE TVET THYPE', item.nftEventType);

                let nft = (item.tokenId) ? item : 
                            (item.nft) ? item.nft : null;

                if(nft) {
                    return fetchNftDetails(nft)
                    .then(res => {
                        nft.name = res.name;
                        nft.image = res.image;

                        return item;
                    });
                } else return item;
            })
        }).flat().filter(item => item != false);

        return Promise.all(promises)
    });
}
