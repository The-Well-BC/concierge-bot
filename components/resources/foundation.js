const axios = require('axios');
const fetchNftDetails = require('./foundation.fetchNftDetails');


module.exports = {
    fetchDrops: function(startTime) {
        let url = 'https://api.thegraph.com/subgraphs/name/f8n/f8n-xdai';

        let marketAction;
        let nftMarketBids;

        const query = `{
            marketActions (where: { timestamp_gt: ${ startTime } }){
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
                    totalBuyPrice
                }
            }

            nftmarketBids(where: { placedOn_gt: ${ startTime } }) {
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
        }`

        return axios.post(url, { query })
        .then(res => {
            marketAction = res.data.data.marketActions;
            nftMarketBids = res.data.data.nftmarketBids;

            let counter = 0;

            const fetchNftsForMarketBids = function() {
                if(counter == nftMarketBids.length) 
                    return;

                let nft = nftMarketBids[counter].nft;
                console.log('counter  for makert bids', nft);
                return fetchNftDetails(nft)
                .then(res => {
                    nft.name = res.name;
                    nft.image = res.image;
                    counter++;
                    return fetchNftsForMarketBids();
                });
            }

            return fetchNftsForMarketBids();
        }).then(res => {
            let counter = 0;

            const fetchNftsForMarketActions = function() {
                if(counter == marketAction.length) 
                    return;

                let nft = marketAction[counter].nft;
                console.log('counter  for market action', nft);

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

            let drops = marketAction.map( item => {
                let type = (item.nft) ? 'nft' : 'xyk';

                const showcase = item.nft || item.market;
                if(item.market) {
                    showcase.price = showcase.totalBuyPrice
                } else {
                    showcase.price = showcase.minBidNow
                }

                const brand = item.brand;
                item.date = item.timestamp;

                return {
                    price: '$' + (showcase.price / 1000000000000000000).toFixed(2),
                    name: showcase.name,
                    date: new Date(item.date * 1000),
                    service: 'foundation',
                    brand: brand.name,
                    action: item.actionType,
                    img: null
                }
            });

            let bidDrops = nftMarketBids.map( bidItem => {
                let type = 'nft';

                const nft = bidItem.nft;

                const brand = bidItem.nft.brand;
                bidItem.date = bidItem.timestamp;

                return {
                    price: '$' + nft.minBidPrice,
                    minBid: '$' + bidItem.value,
                    name: nft.name,
                    date: new Date(bidItem.placedOn * 1000),
                    service: 'foundation',
                    brand: brand.name,
                    status: bidItem.status,
                    action: bidItem.actionType,
                    img: nft.image
                }
            });

            drops.push(...bidDrops);

            return drops;
        });
    }
}
