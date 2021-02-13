const fetchAll = require('./fetchAll');
let dropFormatter = require('./formatters/drops');
let saleFormatter = require('./formatters/sales');

module.exports = {
    fetchEvents: (startTime, limit) => {
        let events = [];
        return fetchAll(startTime, limit)
        .then(res => {
            return res.map(item => {
                let payload;

                let eventType = item.type;

                switch(eventType) {
                    case 'drop':
                        payload = dropFormatter(item);
                        break;
                    case 'sale':
                    case 'buy':
                    case 'ACCEPT_BID':
                        payload = saleFormatter(item);
                        break;
                    case 'BID':
                    case 'AUCTION_BID':
                        payload = bidFormatter(item);
                        break;
                    default:
                        payload = false; 
                        break;
                }

                // console.log('PAYLOAD', payload);

                return payload;
            }).flat()
            .filter(item => {
                return (new Date(item.date) >= new Date(startTime)) && item !== false;
            });
        })
    }
}
