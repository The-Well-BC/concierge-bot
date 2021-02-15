const axios = require('axios');
const fetchNftDetails = require('./fetchNftDetails');

module.exports = function(startTime, limit) {
    let url = 'https://api.thegraph.com/subgraphs/name/f8n/f8n-mainnet';

    let date = parseInt(startTime / 1000);

    let drops, bids, sales;

    let additionalQuery =  ``;

    if(limit && typeof limit === 'number') {
        if(limit < 4)
            limit = 4;
         additionalQuery += `, first: ${ parseInt(limit/4) }`;
    }

    const query = `{
        drops: nfts ( where: { dateMinted_gte: ${ date }} ${ additionalQuery }) {
            id
            tokenId
            nftContract {
                baseURI
            }
            tokenIPFSPath
            date: dateMinted
        }

        sales: nftMarketAuctions(where: { status: Finalized, dateFinalized_gte: ${ date }} ${ additionalQuery }){
            nft {
                id
                tokenId
                nftContract {
                    baseURI
                }
                tokenIPFSPath
                date: dateMinted
            }
            seller {
                id
            }
            bids (where: {status:FinalizedWinner}) {
                id
                amountInETH
                bidder {
                    id
                }
                status
                date: dateLeftActiveStatus
                datePlaced
            }
            date: dateFinalized
            status
        }
    }`;

    return axios.post(url, { query })
    .then(res => {

        res = res.data.data;

        drops = res.drops.map(i => {
            i.nftEventType = 'drop';
            return i;
        });

        sales = res.sales.map(i => {
            i.nftEventType = 'sale';
            return i;
        });

        let events = [sales, drops].flat();

        let tokenIds = events.map(item => {
            let nft = (item.tokenId) ? item : 
                        (item.nft) ? item.nft : null;

            return nft.tokenId;
        });

        return fetchNftDetails(tokenIds)
        .then(res => {
            return events.map(i => {
                let nft = (i.tokenId) ? i : 
                          (i.nft) ? i.nft : null;

                let nftData = res[nft.tokenId]
                nft.name = nftData.name;
                nft.image = nftData.image;
                nft.creator = nftData.creator;

                nft.creator.url = `https://foundation.app/${nft.creator.username}/`;
                i.url = nft.creator.url + `${nft.name.toLowerCase().replace(/\s/g, '-').replace(/[\(\)]/, '')}-${ nft.tokenId }`;

                return i;
            }).flat().filter(item => item != false);
        });

        return Promise.all(promises)
    });
}
