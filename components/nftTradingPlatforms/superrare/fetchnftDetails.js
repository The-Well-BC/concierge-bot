const axios = require('axios');

const fetch = (item) => {
    let marketAddress = "0x2947f98c42597966a0ec25e92843c09ac17fbaa7";

    const url = "https://superrare.co/api/v2/nft/get";
    return axios.post(url, {
        tokenId: 17084,
        contractAddress: item.contractAddress,
        contractAddresses: [item.contractAddress],
        marketAddress, auctionAddress: marketAddress,

        userAddress :null,
        fingerprint :"7231a9df3801a119b423c971d166dfeb",
    })
    .then(res => {
        return res.data.result;
    });
}

const recursiveFetch = function(nfts, counter, data) {
    if(counter === nfts.length)
        return data;
    return fetch(nfts[counter])
    .then(res => {
        counter++;

        data.push(res);
        return recursiveFetch(nfts, counter, data);
    });
}

module.exports = (nfts) => {
    let counter = 0;
    let data = [];

    return recursiveFetch(nfts, counter, data);
}
