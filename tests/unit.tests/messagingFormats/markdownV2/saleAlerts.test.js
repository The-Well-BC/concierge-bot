const markdown = require('../../../../components/messageFormats/markdownV2');
const chai = require('chai');
const expect = chai.expect;

describe('Test NFT event alerts: SALE', function() {
    let minPayload = {
        date: '2020-11-01T19:42:45.000Z',
        name: 'Mystery Box X',
        platform: 'foundation',
        event: 'sale',
        creator: {
            name: 'Old Frog',
            url: 'https://moon.jpeg.com/u/neue-goods'
        }
    }

    it('When NFT url is present', function() {
        let payload = {
            ...minPayload,
            url: 'https://one.two.three',
            transaction: {
                price: '$80.53',
            }
        }

        let alertMessage =  markdown.alertMessage(payload);
        expect(alertMessage).to.have.property('text', 'An anonymous user bought [Mystery Box X](https://one.two.three) for $80.53 on November 1, 2020 (7:42pm UTC)\n[View Old Frog\'s other creations](https://moon.jpeg.com/u/neue-goods)\n\n_via: Foundation_');
    });

    it('When NFT url is not available', function() {
        let payload = {
            transaction: {
                price: '$80.53',
            },
            ...minPayload
        }

        let alertMessage =  markdown.alertMessage(payload);
        expect(alertMessage).to.have.property('text', 'An anonymous user bought Mystery Box X for $80.53 on November 1, 2020 (7:42pm UTC)\n[View Old Frog\'s other creations](https://moon.jpeg.com/u/neue-goods)\n\n_via: Foundation_');
    });

    it('When buyer property is not available', function() {
        let payload = {
            ...minPayload,
            transaction: {
                price: '$80.53',
            }
        }

        let alertMessage =  markdown.alertMessage(payload);
        expect(alertMessage).to.have.property('text', 'An anonymous user bought Mystery Box X for $80.53 on November 1, 2020 (7:42pm UTC)\n[View Old Frog\'s other creations](https://moon.jpeg.com/u/neue-goods)\n\n_via: Foundation_');
    });

    it('When buyer profile url is available', function() {

        let payload = {
            ...minPayload,
            transaction: {
                price: '$80.53',
            },
            buyer: {
                name: 'John Sommet',
                url: 'https://moon.jpeg.com/u/john-sommet'
            },
        }

        let alertMessage =  markdown.alertMessage(payload);
        expect(alertMessage).to.have.property('text', '[John Sommet](https://moon.jpeg.com/u/john-sommet) bought Mystery Box X for $80.53 on November 1, 2020 (7:42pm UTC)\n[View Old Frog\'s other creations](https://moon.jpeg.com/u/neue-goods)\n\n_via: Foundation_');
    });

    it('When NFT price is stated ', function() {

        let payload = {
            ...minPayload,
            price: '$89.33',
            transaction: {
                price: '$80.53',
            },
            buyer: {
                name: 'John Sommet'
            },
        }

        let alertMessage =  markdown.alertMessage(payload);
        expect(alertMessage).to.have.property('text', 'John Sommet bought Mystery Box X for $80.53 on November 1, 2020 (7:42pm UTC)\nMystery Box X is currently trading at $89.33\n[View Old Frog\'s other creations](https://moon.jpeg.com/u/neue-goods)\n\n_via: Foundation_');
    });

    it('When transaction price is not present', function() {
        // Sale price can be in fiat, or eth or any other crypto token. Sale price is not the same as token in transaction

        let payload = {
            ...minPayload,
            price: '$89.33',
            buyer: {
                name: 'John Sommet'
            },
        }

        let alertMessage =  markdown.alertMessage(payload);
        expect(alertMessage).to.have.property('text', 'John Sommet bought a Mystery Box X token on November 1, 2020 (7:42pm UTC)\nMystery Box X is currently trading at $89.33\n[View Old Frog\'s other creations](https://moon.jpeg.com/u/neue-goods)\n\n_via: Foundation_');
    });
});

