const priceFilter = require('./price');
const eventFilter = require('./eventType');
const nftPlatformFilter = require('./platform');
const creatorFilter = require('./creators');

const defaultFilters = require('./defaultFilters');

module.exports = (payload, chatidArray) => {
    //Where payload is an array of nft events (sales, drops, bids, listings...)
    // chatIDs is an array of chat id objects, collected straight from database

    let sorted = [];
    if(!chatidArray)
        throw new Error('Supply chatID parameter');

    payload.forEach(item => {
        let chatIDs = [];
        let excludedChats = [];

        let price = null;
        let txPrice = null;


        chatidArray.forEach(user => {
            let filters = (user.filters && user.filters.length > 0) ?  user.filters :
                            defaultFilters(user.messenger);

            filters.forEach(filter => {
                let passedFilter = true;

                if(filter._default == true)
                    passedFilter = true;

                else {
                    // Creators
                    if(creatorFilter(item, filter) === false)
                        passedFilter = false;
                    // Prices
                    if(priceFilter(item, filter) === false)
                        passedFilter = false;
                    // Event type: drop, sale, listing...
                    if(eventFilter(item, filter) === false)
                        passedFilter = false;
                    // NFT platform filter
                    if(nftPlatformFilter(item, filter) === false)
                        passedFilter = false;

                }

                if(passedFilter === true && !chatIDs.includes(user.chatID))
                    chatIDs.push(user.chatID);

            });
        });

        if(chatIDs.length > 0)
            sorted.push({ payload: item, chatIDs });
    });

    return sorted;
}
