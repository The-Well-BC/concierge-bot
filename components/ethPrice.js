const axios = require('axios');

let dai = weth = fwb = rac = socks = fame = uni = audio = eth = 5;

const usdc = 1;

let prices = { usdc, weth, fwb, rac, socks, fame, uni, audio, eth, dai };

const updatePrices = function() {
    let url = 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=DAI,ETH,WETH,FWB,RAC,SOCKS,FAME,UNI,AUDIO';

    return axios.get(url)
    .then(res => {
        eth = res.data.ETH, weth = res.data.WETH,
            rac = res.data.RAC, socks = res.data.SOCKS,
            fame = res.data.FAME, uni = res.data.UNI,
            dai = res.data.DAI,
            audio = res.data.AUDIO,
            fwb = res.data.FWB || null;

        prices = { usdc, weth, fwb, rac, socks, fame, uni, audio, eth, dai };

        url = 'https://api.coingecko.com/api/v3/simple/price?ids=unisocks%2Cfame%2Cfriends-with-benefits&vs_currencies=usd';
        return axios.get(url)
    }).then(res => {
        res = res.data;

        socks = 1 / res.unisocks.usd, fame = 1 / res.fame.usd, 
            fwb = 1 / res['friends-with-benefits'].usd;

        prices = { ...prices, fwb, socks, fame };

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
