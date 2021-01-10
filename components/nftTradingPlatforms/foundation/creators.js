const axios = require('axios');
const fetchNftDetails = require('./fetchNftDetails');


module.exports = function(limit) {
    let url = 'https://api.thegraph.com/subgraphs/name/f8n/f8n-xdai';

    let xykmarket;
    let nft721;

    let orderBy = 'productCount';

    let filterQuery = `orderBy: ${ orderBy }, `;

    if(limit && typeof limit === 'number') {
        filterQuery += `first: ${ parseInt(limit)}`;
    }

    const query = `{
        brands(orderDirection: desc, ${ filterQuery }) {
            name
            symbol
            productCount
            totalRevenue
        }
    }`

    return axios.post(url, { query })
    .then(res => {
        return res.data.data.brands.map(item => {
            return {
                name: `${item.name } (${ item.symbol})`,
                url: `https://foundation.app/${ item.symbol }`,
                stats: {
                    products: item.productCount,
                    totalRevenue: item.totalRevenue
                },
                platform: 'foundation',
            }
        });
    });
}
