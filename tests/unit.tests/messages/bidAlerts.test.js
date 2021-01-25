const messages = require('../../../components/messages');
const chai = require('chai');
const expect = chai.expect;

const formats = ['plain', 'markdown', 'markdownV2'];

describe('Test NFT event alerts: BIDS', function() {
    let minPayload = {
        date: '2020-11-01T19:42:45.000Z',
        name: 'Mystery Box X',
        platform: 'nifty',
        event: 'bid',
    }

    it('Test messages when all fields are present', function() {
        let payload = {
            ...minPayload,
            url: 'https://one.two.three',
            bidder: {
                name: 'John Sommet',
                url: 'https://moon.jpeg.com/u/john-sommet'
            },
            transaction: {
                price: '$80.53',
                url: 'https://tx.com'
            }
        }

        let alertMessages = formats.map(format => { 
            return messages.alertMessage(payload, format);
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect(plain).to.have.property('text', 'John Sommet has bid $80.53 on Mystery Box X\n\nMORE:\n\nView Mystery Box X - https://one.two.three\nView bid - https://tx.com\n\nvia: Nifty Gateway');
        expect(markdown).to.have.property('text', 'John Sommet has bid $80.53 on [Mystery Box X](https://one.two.three)\n\nMORE:\n\n[View bid](https://tx.com)\n\nvia: [Nifty Gateway](https://niftygateway.com)');
    });

    it('When image is present', function() {
        let payload = {
            ...minPayload,
            url: 'https://one.two.three',
            img: 'https://123.com',
            transaction: {
                price: '$80.53',
            }
        }

        let alertMessages = formats.map(format => { 
            return messages.alertMessage(payload, format);
        });

        expect(alertMessages).to.all.have.property('photo', 'https://123.com');
    });

    it('When bidder property is not available', function() {
        let payload = {
            ...minPayload,
            transaction: {
                price: '$80.53',
            }
        }

        let alertMessages = formats.map(format => { 
            return messages.alertMessage(payload, format);
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect(alertMessages).to.all.satisfy(message => {
            expect(message.text).to.match(/^A bid of \$80\.53/);
            return true;
        });
    });

    it('When transaction price is not present', function() {
        // Sale price can be in fiat, or eth or any other crypto token. Sale price is not the same as token in transaction

        let payload = {
            ...minPayload,
            price: '$89.33',
            bidder: {
                name: 'John Sommet'
            },
            creator: {
                name: 'Old Frog',
            }
        }

        let alertMessages = formats.map(format => { 
            return messages.alertMessage(payload, format);
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect(alertMessages).to.all.satisfy(message => {
            expect(message.text).to.have.string('John Sommet made a bid for Mystery Box X');
            return true;
        });
    });
});

