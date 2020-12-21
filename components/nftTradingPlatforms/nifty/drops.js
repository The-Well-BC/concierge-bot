const axios = require('axios');

module.exports = function(startTime) {
    const url = 'https://api.niftygateway.com//drops/open/?size=3&current=1';
    return axios.get(url)
    .then(res => {
        let drops = [];
        res.data.listOfDrops.map(item => {
            drops.push(...item.Exhibitions);
        });
        return drops.map(item => {
            return {
                name: item.storeName,
                creator: {
                    name: item.userProfile.name,
                    url: `https://niftygateway.com/profile/${item.userProfile.profile_url}`
                },
                platform: 'Nifty Gateway',
                date: item.Timestamp,
                type: 'drop',
                url: `https://niftygateway.com/collections/${ item.storeURL }`,
                img: item.project_cover_photo_url
            }
        }).filter(item => {
            return (new Date(item.date) >= startTime);
        });
    });
}
