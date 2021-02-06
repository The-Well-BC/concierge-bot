const expect = require('chai').expect;
const clone = require('rfdc')();
const command = require('../../components/commands');
const samplePayload = require('../samplePayload');
const subdao = require('../../components/daos/subscription.dao');

const formats = ['plain', 'markdown'];
const messengers = ['twitter', 'telegram']

const chatIDs = ['1234', '5673', '9102', '4567'];

describe('The Subscribe Command', function() {
    const chatID = '1234';

    const payload = {
        command: { name: 'subscribe' },
        user: { username: 'Adesuwa' }, chatID,
    };

    let subPlatformText =  'Successfully added subscription filter: ';
    beforeEach(() => {
        const teardown = require('../teardown');
        return teardown();
    });

    it('Subscribe with no params', function() {
        let promises = Array.apply(null, {length: 2}).map((a, i) => {
            payload.format = formats[i % 2];
            let messenger = messengers[ i % 2];
            // payload.format = formats[i];
            return command(payload, messenger);
        });

        return Promise.all(promises)
        .then(message => {
            expect(message).to.all.have.property('text');
            expect(message).to.all.have.property('text', 'You have opted to receive notifications whenever any NFTs are traded or released.');
            return subdao.fetchSubscription(chatID)
        }).then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res).to.have.deep.members([
                { chatID, filters: [], messenger: 'telegram' },
                { chatID, filters: [], messenger: 'twitter' },
            ]);
        });
    });

    it('subscribe nft platforms', function() {
        const params = ['superrare', 'nifty, SuperRAre'];

        let promises = params.map((a, i) => {
            payload.command.params = params[i % 2];
            let messenger = messengers[i % 2];
            return command(payload, messenger);
        });

        return Promise.all(promises)
        .then(res => {
            expect(res).to.have.lengthOf(2);
            expect([res[0]]).to.all.have.property('text', subPlatformText + 'NFT events on SuperRare');
            expect([res[1]]).to.all.have.property('text', subPlatformText + 'NFT events on Nifty Gateway, and SuperRare');

            return subdao.fetchSubscription(chatID)
        })
        .then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res).to.have.deep.members([
                { chatID, filters: [{ platforms: ['superrare']}], messenger: 'twitter' },
                { chatID, filters: [{ platforms: ['nifty', 'superrare']}], messenger: 'telegram' },
            ]);
        });
    });

    it('subscribe to events', function() {
        const chatID = '1234';

        const params = ['sale drops', 'listing' ];

        let promises = params.map((p, i) => {
            payload.command.params = p;
            let messenger = messengers[i % 2];
            return command(payload, messenger);
        });

        return Promise.all(promises)
        .then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res[0]).to.have.property('text', 'Successfully added subscription filter: NFT sales, and drops');
            expect(res[1]).to.have.property('text', 'Successfully added subscription filter: NFT listings');

            return subdao.fetchSubscription(chatID)
        })
        .then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res).to.have.deep.members([
                { chatID, filters: [{ events: ['sale', 'drop']}], messenger: 'twitter' },
                { chatID, filters: [{ events: ['listing']}], messenger: 'telegram' }
            ]);
        });
    });


    it('subscribe to NFT creators', function() {
        const params = ['creator Adam Nunberg', 'creator Adam Nunberg, FootPaw' ];

        let promises = params.map((p, i) => {
            payload.command.params = p;
            let messenger = messengers[i % 2];
            return command(payload, messenger);
        });

        return Promise.all(promises)
        .then(res => {
            const single = [ res[0] ];
            const multiple = [ res[1] ];

            expect(res).to.have.lengthOf(2);
            expect(single).to.all.have.property('text', 'Successfully added subscription filter: NFTs created by Adam Nunberg');
            expect(multiple).to.all.have.property('text', 'Successfully added subscription filter: NFTs created by Adam Nunberg, FootPaw');

            return subdao.fetchSubscription(chatID)
        })
        .then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res).to.have.deep.members([
                { chatID, filters: [{ creators: ['Adam Nunberg']}], messenger: 'twitter' },
                { chatID, filters: [{ creators: ['Adam Nunberg', 'FootPaw']}], messenger: 'telegram' },
            ]);
        });
    });

    let promiseMaker = function(payload, params) {
        payload.command.params = params;
        return command(payload, 'telegram');
    }

    describe('Filter - Subscribe to NFT Value', function() {
        // Phrases
        // Token is worth at least $300
        // Item is worth at most $500
        // Item is worth more than $500
        // Item is worth less than $500
        // 
        //User should use a comma (,) to separate filter conditions

        let subscribe = function() {
        }

        beforeEach(() => {
            const teardown = require('../teardown');
            return teardown()
            .then(() => {
                return subdao.fetchSubscription(chatID)
            }).then(res => {
                expect(res).to.be.empty;

                let promises = Array.apply(null, {length: 2}).map((a, i) => {
                    let p = {
                        ...payload,
                        command: { name: 'subscribe' },
                        format: 'plain'
                    }
                    return command(p, 'telegram');
                });

                return Promise.all(promises);
            });
        });

        let filters = [
            {
                name: 'Greater Than', params: ['NFT worth more than 5.43 Eth', 'NFT is worth more than 5.43ETH', 'item is worth more than 5.43 eth', 'token worth more than 5.43 ETH'], successMessage: 'Successfully added subscription filter: Events for items that are worth more than 5.43 ETH', filter: { priceGT: '5.43 ETH' }
            }, {
                name: 'Greater Than or Equal To (GTE)', params: ['NFTs worth at least $11234', 'item is worth $11234 or more', 'NFTs worth a minimum of $11234', 'tokens worth more than or equal to $11234', 'items worth atleast $11234'], successMessage: 'Successfully added subscription filter: Events for items that are worth $11,234 or more', filter: { priceGTE: '$11234' }
            }, {
                name: 'Less Than (LT)', params: ['NFT is less than 9.13eth', 'item is less than 9.13 eth', 'token is worth less than 9.13eth'], successMessage: 'Successfully added subscription filter: Events for items that are worth less than 9.13 ETH', filter: { priceLT: '9.13 ETH' }
            }, {
                name: 'Less Than or Equal To (LTE)', params: ['NFTs worth at most 754 eth', 'item worth 754 eth or less', 'tokens worth 754 eth max', 'tokens worth 754 eth maximum'], successMessage: 'Successfully added subscription filter: Events for items that are worth 754 ETH or less', filter: { priceLTE: '754 ETH' }
            }
        ];

        filters.forEach(test => {
            test.params.forEach((p, index) => {

                it('Filter - ' + test.name + '. Variation ' + (index + 1), function() {
                    const params = p;

                    return promiseMaker(payload, params)
                    .then(res => {
                        expect(res).to.have.property('text', test.successMessage);
                        return subdao.fetchSubscription(chatID)
                    })
                    .then(res => {
                        expect(res).to.have.deep.members([
                            { chatID, filters: [test.filter], messenger: 'telegram' },
                        ]);
                    });
                });
            });
        });
    });

    describe('Filter - Subscribe to Transaction value', function() {
        // NFT sells for above $500
        // NFT sells for below $500
        // NFT sells for at least $500
        // NFT sells for at most $500
        // minimum bid of $500
        // maximum bid of $200
        // bids of at least $500
        // sales of at least $500
        // listings of at most $4000 and at least $1500, items worth at least $700
        //

        beforeEach(() => {
            const teardown = require('../teardown');
            return teardown()
            .then(() => {
                let promises = Array.apply(null, {length: 2}).map((a, i) => {
                    let p = {
                        ...payload,
                        command: { name: 'subscribe' },
                        format: 'plain'
                    }
                    return command(p, 'telegram');
                });

                return Promise.all(promises);
            });
        });

        let filters = [
            {
                name: 'Greater Than', params: ['sale price greater than $1234', 'sale for more than $1234', 'sales for more than $1234', 'sells for more than $1234', 'sells over $1234', 'sale over $1234'], successMessage: 'Successfully added subscription filter: NFT sales over $1,234', filter: { events: ['sale'], txPriceGT: '$1234' }
            }, {
                name: 'Greater Than or Equal To (GTE)', params: ['transaction at least 30 ETH.00', 'All transactions that are greater than or equal to 30eth', 'transaction atleast 30ETH'], successMessage: 'Successfully added subscription filter: Events for transactions of 30 ETH and above', filter: { txPriceGTE: '30 ETH' }
            }, {
                name: 'Less Than (LT)', params: ['bids, listings below $123.48', 'bids and listings less than $123.48', 'bids and new listings under $123.48'], successMessage: 'Successfully added subscription filter: NFT bids, and listings under $123.48', filter: { events: ['bid', 'listing'], txPriceLT: '$123.48' }
            }, {
                name: 'Less Than or Equal To (LTE)', params: ['Offers less than or equal to $1234', 'Offers of at most $1234', 'NFT offers of $1,234 and below', 'NFT offers of $1,234 and under'], successMessage: 'Successfully added subscription filter: NFT offers of $1,234 and under', filter: { events: ['offer'], txPriceLTE: '$1234' }
            }
        ];

        filters.forEach(test => {
            test.params.forEach((p, index) => {
                it('Transaction Filter - ' + test.name + '. Variation ' + (index + 1), function() {
                    const params = p;

                    return promiseMaker(payload, params)
                    .then(res => {
                        expect(res).to.have.property('text', test.successMessage);
                        return subdao.fetchSubscription(chatID)
                    })
                    .then(res => {
                        expect(res).to.have.deep.members([
                            { chatID, filters: [test.filter], messenger: 'telegram' },
                        ]);
                    });
                });
            });
        });
    });
});

