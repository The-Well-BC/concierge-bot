const axios = require('axios');

module.exports = {
    fetchDrops: function() {
        const url = 'https://api.ourzora.com/graphql';
        const query = `{
            blah(first: 3) {
                name
            }
        }`

        /*
        return axios.post(url, { query })
        .then( res => {
            console.log('RESS', res);
            res=res.data;
            // return res;
            return []
        });
        */

        return new Promise(resolve => resolve([]));
    }
}
