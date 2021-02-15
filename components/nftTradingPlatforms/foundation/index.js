const fetchAll = require('./fetchAll');
let dropFormatter = require('./formatters/drops');
let saleFormatter = require('./formatters/sales');
let bidFormatter = require('./formatters/bids');
const creators = require('./creators');

module.exports = {
    fetchCreators: creators,
    fetchEvents: (startTime, limit) => {
        let events = [];
        return fetchAll(startTime, limit)
        .then(res => {
            return res.map(item => {
                let payload;

                let eventType = item.nftEventType;

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
                payload.date = new Date(payload.date * 1000);

                return payload;
            }).flat()
            .filter(item => {
                return (item.date >= new Date(startTime)) && item !== false;
            });
        })
    }
}
