const axios = require('axios');

module.exports = (nft) => {
    const url = `https://api.foundation.app/nft/${ nft.tokenId }`;
    return axios.get(url)
    .then(res => {
        return {
            name: res.data.name,
            image: res.data.image
        }
    });
}
