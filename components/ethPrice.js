const axios = require('axios');

let dai = weth = fwb = rac = socks = fame = uni = audio = eth = 5;

let prices = { weth, fwb, rac, socks, fame, uni, audio, eth, dai };

const updatePrices = function() {
    const url = 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=DAI,ETH,WETH,FWB,RAC,SOCKS,FAME,UNI,AUDIO';

    return axios.get(url)
    .then(res => {
        eth = res.data.ETH, weth = res.data.weth,
            rac = res.data.RAC, socks = res.data.SOCKS,
            fame = res.data.FAME, uni = res.data.UNI,
            dai = res.data.DAI,
            audio = res.data.AUDIO,
            fwb = res.data.FWB || null;

        prices = { weth, fwb, rac, socks, fame, uni, audio, eth, dai };

        return prices;
    });
}

module.exports = {
    getEth: () => eth,
    getPrices: () => prices,
    updateEth: updatePrices,
    updatePrice: updatePrices,
    updatePrices,

    // Only call this function when testing.
    reset: () => {
        weth = fwb = rac = socks = fame = uni = audio = eth = dai = 5;
    }
}
