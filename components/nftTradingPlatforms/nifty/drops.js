const axios = require('axios');

module.exports = function(startTime, limit = 3) {
    if(typeof limit !== 'number')
        limit = 3;

    const url = `https://api.niftygateway.com//drops/open/?size=${ limit }&current=1`;

    return axios.get(url)
    .then(res => {
        let drops = [];
        res.data.listOfDrops.forEach(item => {
            drops.push(...item.Exhibitions);
        });

        if(limit && typeof limit === 'number' && !isNaN(limit) && limit != 0) {
            let index = limit;
            drops = drops.slice(0, index);
        }

        return drops.map(item => {
            let url = `https://niftygateway.com/collections/${ item.storeURL}`;

            return {
                name: item.storeName,
                creator: {
                    name: item.userProfile.name,
                    url: `https://niftygateway.com/profile/${ item.userProfile.profile_url }`
                },
                platform: 'nifty',
                date: item.Timestamp,
                event: 'drop',
                url,
                img: item.project_cover_photo_url
            }
        }).filter(item => {
            return new Date(item.date) >= startTime;
        });
    });
}
