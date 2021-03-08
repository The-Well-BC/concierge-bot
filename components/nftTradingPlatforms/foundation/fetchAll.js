const axios = require('axios');
const fetchNftDetails = require('./fetchNftDetails');

module.exports = function(startTime, limit, creators) {
    let url = 'https://api.thegraph.com/subgraphs/name/f8n/f8n-mainnet';

    let date = parseInt(startTime / 1000);

    let drops, bids, sales;

    let additionalQuery =  ``;

    if(limit && typeof limit === 'number') {
        if(limit < 4)
            limit = 4;
         additionalQuery += `, first: ${ parseInt(limit/4) }`;
    }

    let creatorStr = creators.join('","');

    const query = `{
        drops: nfts ( where: { dateMinted_gte: ${ date }, creator_in: ["${ creatorStr }"]} ${ additionalQuery }) {
            id
            tokenId
            nftContract {
                baseURI
            }
            creator {
                id
            }
            tokenIPFSPath
            date: dateMinted
        }

        sales: nftMarketAuctions(where: { status: Finalized, dateFinalized_gte: ${ date }} ${ additionalQuery }){
            nft {
                id
                tokenId
                creator {
                    id
                }
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

            return { id: nft.tokenId, creatorAddr: nft.creator.id };
        });

        return fetchNftDetails(tokenIds.map(i => i.id))
        .then(res => {
            return events.map(i => {
                let nft = (i.tokenId) ? i : 
                          (i.nft) ? i.nft : null;

                let nftData = res[nft.tokenId]
                nft.name = nftData.name;
                nft.image = nftData.image;
                nft.creator = nftData.creator;
                let address;

                if(i.nft && i.nft.creator) {
                    address = i.nft.creator.publicKey
                } else if(i.creator)
                    address= i.creator.publicKey

                nft.creator.wallet = {
                    address
                }

                nft.creator.url = `https://foundation.app/${nft.creator.username}/`;
                i.url = nft.creator.url + `nft-${ nft.tokenId }`;

                return i;
            }).flat().filter(item => item != false)
            .filter(i => {
                let creatorAddr = (i.nft) ? i.nft.creator.publicKey : i.creator.publicKey;
                return creators.includes(creatorAddr.toLowerCase())
            });
        });

        return Promise.all(promises)
    });
}
