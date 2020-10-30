const axios = require('axios');

module.exports = {
    fetchDrops: function() {
        const url = 'https://api.ourzora.com/graphql';
        const query = `{
            products {
                name
                organisation {
                    name
                }
                releaseDate
                title
                featuredImage {
                    mediaURL
                }
                variants {
                    token {
                        latestPrice
                    }
                }
            }
        }`

        return axios.post(url, { query })
        .then( res => {
            const products = res.data.data.products.map(p => {
                const { name, title, featuredImage, organisation, releaseDate, variants } = p;
                const img = (featuredImage) ? featuredImage.mediaURL : null;
                const price = '$' + variants[0].token.latestPrice;
                return {
                    name: `${ name } - ${ title }`,
                    brand: organisation.name,
                    img,
                    price,
                    service: 'zora',
                    date: releaseDate
                }
            });

            return products;
        }).catch(e => {
            console.log('ERRRO');
            console.log(e.response.data);
            console.log(e.response.data.errors[0].locations);
            console.log(e.response.data.errors[0].extensions);
            throw e;
        });
    }
}
