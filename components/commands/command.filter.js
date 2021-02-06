const subscribedao = require('../daos/subscription.dao');
const platformNames = require('../nftTradingPlatforms/platformNames');
const filterMessage = require('../messages/messages.subscriptionFilters');

const commands = require('./text');

const subscribe = function(chat_id, messenger, params) {
    let filterCommand = commands.subscriptionFilter[messenger];

    if(!params) {
        return subscribedao.fetchSubscription(chat_id, messenger)
        .then(res => {
            let text = 'Your Subscription Filters\nYou will only receive notifications that pass at least one of your filters\n';
            text += `Type ${ filterCommand } delete <number> to delete a filter\n`;

            res[0].filters.forEach((filter, i) => {
                text += `\n${i + 1}. `;
                let { events, platforms, creators,
                    priceGT, priceLT, priceGTE, priceLTE,
                    txPriceGT, txPriceLT, txPriceGTE, txPriceLTE
                } = filter;

                text += filterMessage(filter);
            });

            return { text };

            for(key in platformNames) {
                const name = platformNames[key].name;

                const nameRegex = new RegExp(name, 'ig');
            }
        });
    } else {
        if(params.includes('delete')) {
            let text = 'Successfully deleted filter';

            let filterNo = params.match(/(?<=delete)\s+\d+/ig)[0];
            filterNo = parseInt(filterNo);

            return subscribedao.deleteFilter(chat_id, messenger, filterNo)
            .then(res => {
                return { text };
            });
        }
    }
}

module.exports = subscribe;
