const fetchAll = require('./fetchAll');
let dropFormatter = require('./formatters/drops');
let saleFormatter = require('./formatters/sales');

module.exports = {
    fetchEvents: (startTime, limit) => {
        let events = [];
        return fetchAll(startTime, limit)
        .then(res => {
            // console.log('ALL ITEMS', res);
            return res.map(item => {
                let payload;

                let eventType = item.event;

                switch(eventType) {
                    case 'drop':
                        payload = dropFormatter(item);
                        break;
                    case 'sale':
                        payload = saleFormatter(item);
                        break;
                    case 'bid':
                        payload = bidFormatter(item);
                        break;
                    default:
                        payload = false; 
                        break;
                }

                if(payload) {
                    let media = (item.media) ? item.media : item;
                    if(media && media.creator) {
                        payload.url = media.creator.url + '/' + media.id;
                    }
                }
                return payload;
            }).flat()
            .filter(item => {
                return (new Date(item.date) >= new Date(startTime)) && item !== false;
            });
        })
    }
}
