const axios = require('axios');

module.exports = (tokenids) => {
    const url = 'https://api.foundation.app/graphql';

    let query = `query getArtworksBatch($artworkIds: [String!], $includeHidden: Boolean) {
            artworks: artworksByTokenIds(tokenIds: $artworkIds includeHidden: $includeHidden) {
                ...ArtworkFragment
                creator: user {
                    ...UserFragment
                }
            }
        }
        fragment ArtworkFragment on Artwork {
           id name description  assetIPFSPath  metadataIPFSPath  mintTxHash  auctionStartTxHash  width  height  duration  mimeType  muxStatus  muxMaxResolution  muxPlaybackId  muxId  tokenId  status  hiddenAt  deletedAt}fragment UserFragment on User {  userIndex  publicKey  username  name  firstName  lastName  isAdmin  providerType  bio  coverImageUrl  profileImageUrl  isApprovedCreator 
               links { twitter {      platform      handle    }  }}
    `;
   let variables = { artworkIds:tokenids, includeHidden:false };

    return axios.post(url, {query, variables})
    .then(res => {
        let tokenObj = {};

        res.data.data.artworks.forEach(item => {
            tokenObj[item.tokenId] = item;
        });

        return tokenObj;
    });
}
