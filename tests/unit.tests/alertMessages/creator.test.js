const chai = require('chai');

const expect = chai.expect;

const plain = require('../../../components/messages');

describe('Creators text', function() {

    const basePayload = {
        name: 'Vucci Du Vonne',
        platform: 'nifty',
        stats: {
            products: 21,
            totalRevenue: '$3103.58'
        }
    }

    it('Creator moniker', function() {
        const payload = [{
            ...basePayload,
            moniker: 'VUCCI',
            url: 'https://app.foundation/vucci',
        }, {
            name: 'Johann Du Burg',
            moniker: 'JBRG',
            url: 'https://johann',
            platform: 'superrare',
            stats: {
                products: 2,
                totalRevenue: '15 ETH'
            }
        }]

        let message = plain.creatorSummary(payload, 'twitter');

        expect(message, 'Markdown format').to.have.property('text', 'Vucci Du Vonne (VUCCI)\nNFTs released: 21\nTotal Revenue: $3103.58\nView Vucci Du Vonne\'s profile here - https://app.foundation/vucci\n\nJohann Du Burg (JBRG)\nNFTs released: 2\nTotal Revenue: 15 ETH\nView Johann Du Burg\'s profile here - https://johann');
        expect(message).to.have.property('replies').that.eql([
            { text: '!subscribe creator "Vucci Du Vonne"' },
            { text: '!subscribe creator "Johann Du Burg"' }
        ]);
    });

    it('No Creator moniker', function() {
        const payload = [{
            ...basePayload,
            url: 'https://app.foundation/vucci',
        }, {
            name: 'Johann Du Burg',
            url: 'https://johann',
            platform: 'superrare',
            stats: {
                products: 2,
                totalRevenue: '15 ETH'
            }
        }];

        let message = plain.creatorSummary(payload, 'telegram');

        expect(message).to.have.property('text', 'Vucci Du Vonne\nNFTs released: 21\nTotal Revenue: $3103.58\nView Vucci Du Vonne\'s profile here - https://app.foundation/vucci\n\nJohann Du Burg\nNFTs released: 2\nTotal Revenue: 15 ETH\nView Johann Du Burg\'s profile here - https://johann');

        expect(message).to.have.property('replies').that.eql([
            { text: '/subscribe creator "Vucci Du Vonne"' },
            { text: '/subscribe creator "Johann Du Burg"' }
        ]);
    });

});
