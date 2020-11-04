const axios = require('axios');
const fetchHistoricalTicks = require('./zora.fetchHistoricalTicks');

module.exports = {
    fetchDrops: function(startTime) {
        let products;

        const url = 'https://api.ourzora.com/graphql';
        const query = `{
            products {
                name 
                title
                featuredImage { mediaURL }
                organisation { name }
                variants {
                    token {
                        name
                        latestPrice
                        address
                    }
                }
                releaseDate
            }
        }`

        return axios.post(url, { query })
        .then( res => {
            products = res.data.data.products;

            let counter = 0;

            const fetchProductsLatestData = () => {
                if(counter == products.length)
                    return;

                let p = products[counter];
                let token = p.variants[0].token;

                return fetchHistoricalTicks(token, startTime)
                .then(tick => {
                    if(tick == null) {
                        products.splice(counter, 1);
                    } else {
                        p.date = tick.timestamp;
                        p.latestPrice = tick.latest;
                        counter++;
                    }
                    return fetchProductsLatestData();
                });
            }

            return fetchProductsLatestData()
        }).then(res => {
            return products.map(p => {
                const { name, title, featuredImage, organisation, releaseDate, variants } = p;
                const img = (featuredImage) ? featuredImage.mediaURL : null;
                console.log('PRODUCT', p);
                let price = p.latestPrice / 1000000;
                price = '$' + parseFloat(price).toFixed(2);

                return {
                    name: `${ name } - ${ title }`,
                    brand: organisation.name,
                    img,
                    price,
                    service: 'zora',
                    date: p.date,
                    releaseDate
                }
            });
        }).catch(e => {
            console.log('ERRRO');
            throw e;
        });
    }
}
