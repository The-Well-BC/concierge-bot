const axios = require('axios');

module.exports = {
    fetchDrops: function() {
        const url = 'https://api.thegraph.com/subgraphs/name/f8n/f8n-xdai';
        const query = `{
              foundations(first: 5) {
                id
                brands { id }
                revenue
              }
              brands(first: 5) {
                id
                address
                name
                symbol
              }
        }`;

        return axios.post(url, { query })
        //return axios.post(url, JSON.stringify(query))
        .then(res => {
            res = res.data.data;
            console.log('RESSSSSSS', res.brands);
            return res.brands;
        });
    }
}
