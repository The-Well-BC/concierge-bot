const chai = require('chai');

const expect = chai.expect;

const markdown = require('../../../../components/messageFormats/markdown');

describe.skip('Creators text', function() {

    const basePayload = {
        name: 'Vucci Du Vonne',
        platform: 'nifty',
        stats: {
            products: 21,
            totalRevenue: '$3103.58'
        }
    }

    it('Creator moniker', function() {
        const payload = {
            ...basePayload,
            moniker: 'VUCCI',
            url: 'https://app.foundation/vucci',
        }

        let message = markdown.creatorSummary(payload, 'telegram');

        expect(message, 'Markdown format').to.have.property('text', '[Vucci Du Vonne (VUCCI)](https://app.foundation/vucci)\nNFTs released: 21\nTotal Revenue: $3103.58');
        expect(message).to.have.property('replies').that.eql([
            { text: '/subscribe creator "Vucci Du Vonne"' }
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

        let message = markdown.creatorSummary(payload, 'telegram');

        expect(message).to.have.property('text', '[Vucci Du Vonne](https://app.foundation/vucci)\nNFTs released: 21\nTotal Revenue: $3103.58\n\n[Johann Du Burg](https://johann)\nNFTs released: 2\nTotal Revenue: 15 ETH');

        expect(message).to.have.property('replies').that.eql([
            { text: '/subscribe creator "Vucci Du Vonne"' },
            { text: '/subscribe creator "Johann Du Burg"' }
        ]);
    });

});
