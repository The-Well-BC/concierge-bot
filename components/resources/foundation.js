const axios = require('axios');

module.exports = {
    fetchDrops: function() {
        const url = 'https://api.thegraph.com/subgraphs/name/f8n/f8n-xdai';
        const now = new Date();
        let startTime = new Date().setMonth(now.getMonth() - 4);
        startTime = parseInt(startTime/1000);
        console.log('Start Time', startTime);

        const query = `{
            xykmarkets(where: {goLiveDate_gt: ${ startTime } }) {
                name
                goLiveDate
                totalBuyPrice
                brand {
                    name 
                }
            }
        }`;

        return axios.post(url, { query })
        .then(res => {
            const drops = res.data.data.xykmarkets;
            return drops.map( item => {
                return {
                    price: '$' + (item.totalBuyPrice / 1000000000000000000).toFixed(2),
                    name: item.name,
                    date: new Date(item.goLiveDate * 1000),
                    service: 'foundation',
                    brand: item.brand.name,
                    img: null
                }
            });
        });
    }
}
