const axios = require('axios');

let eth = 5;

const updateEth = function() {
    const url = 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=ETH';

    return axios.get(url)
    .then(res => {
        let newEth = res.data.ETH;
        eth = newEth;
        return newEth;
    });
}

module.exports = {
    getEth: () => eth,
    updateEth
}
