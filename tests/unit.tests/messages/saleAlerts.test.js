const messages = require('../../../components/messages');
const chai = require('chai');
const expect = chai.expect;

const formats = ['plain', 'markdown', 'markdownV2'];

describe('Test NFT event alerts: SALE', function() {
    let minPayload = {
        date: '2020-11-01T19:42:45.000Z',
        name: 'Mystery Box X',
        platform: 'nifty',
        event: 'sale',
        creator: {
            name: 'Old Frog',
            url: 'https://moon.jpeg.com/u/neue-goods'
        }
    }

    it('Test messages when all fields are present', function() {
        let payload = {
            ...minPayload,
            url: 'https://one.two.three',
            buyer: {
                name: 'John Sommet',
                url: 'https://moon.jpeg.com/u/john-sommet'
            },
            transaction: {
                price: '$80.53',
            }
        }

        let alertMessages = formats.map(format => { 
            return messages.alertMessage(payload, format);
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect(plain).to.have.property('text', 'Mystery Box X by Old Frog sold to John Sommet for $80.53 on November 1, 2020 (7:42pm UTC)\n\nMORE:\nhttps://one.two.three\nvia: Nifty Gateway');
        expect(markdown).to.have.property('text', '[Mystery Box X](https://one.two.three) by Old Frog sold to John Sommet for $80.53 on November 1, 2020 (7:42pm UTC)\n\nMORE:\n[View Old Frog\'s other creations](https://moon.jpeg.com/u/neue-goods)\n\nvia: [Nifty Gateway](https://niftygateway.com)');
    });

    it('When NFT url is present', function() {
        let payload = {
            ...minPayload,
            url: 'https://one.two.three',
            transaction: {
                price: '$80.53',
            }
        }

        let alertMessages = formats.map(format => { 
            return messages.alertMessage(payload, format);
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect(plain.text).to.have.string('Mystery Box X by Old Frog')
        expect(markdown.text).to.have.string('[Mystery Box X](https://one.two.three)');
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

    it('When NFT url is not available', function() {
        let payload = {
            transaction: {
                price: '$80.53',
            },
            ...minPayload
        }

        let alertMessages = formats.map(format => { 
            return messages.alertMessage(payload, format);
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect(plain.text).to.match(/^Mystery Box X/);
        expect(markdown.text).to.match('^Mystery Box X ');
    });

    it('When buyer property is not available', function() {
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
            expect(message.text).to.match(/an anonymous user /);
            expect(message.text).to.not.match(/^An anonymous user /);
            return true;
        });
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

        let alertMessages = formats.map(format => { 
            return messages.alertMessage(payload, format);
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect(plain.text).to.have.string('John Sommet');
        expect(markdown.text).to.have.string('[John Sommet](https://moon.jpeg.com/u/john-sommet)')
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

        let alertMessages = formats.map(format => { 
            return messages.alertMessage(payload, format);
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect(plain.text).to.have.string('$80.53 on November 1, 2020 (7:42pm UTC)\nMystery Box X is currently trading at $89.33\nView Old Frog\'s other creations - https://moon.jpeg.com/u/neue-goods\n\nvia: Nifty Gateway');
        expect(markdown).to.have.property('text', 'John Sommet bought Mystery Box X for $80.53 on November 1, 2020 (7:42pm UTC)\nMystery Box X is currently trading at $89.33\n[View Old Frog\'s other creations](https://moon.jpeg.com/u/neue-goods)\n\nvia: [Nifty Gateway](https://niftygateway.com)');
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

        let alertMessages = formats.map(format => { 
            return messages.alertMessage(payload, format);
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect(plain.text).to.have.string('$80.53 on November 1, 2020 (7:42pm UTC)\nMystery Box X is currently trading at $89.33\nView Old Frog\'s other creations - https://moon.jpeg.com/u/neue-goods\n\nvia: Nifty Gateway');
        expect(markdown).to.have.property('text', 'John Sommet bought Mystery Box X for $80.53 on November 1, 2020 (7:42pm UTC)\nMystery Box X is currently trading at $89.33\n[View Old Frog\'s other creations](https://moon.jpeg.com/u/neue-goods)\n\nvia: [Nifty Gateway](https://niftygateway.com)');
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

        let alertMessages = formats.map(format => { 
            return messages.alertMessage(payload, format);
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect(plain).to.have.property('text', 'John Sommet bought a Mystery Box X token on November 1, 2020 (7:42pm UTC)\nMystery Box X is currently trading at $89.33\nView Old Frog\'s other creations - https://moon.jpeg.com/u/neue-goods\n\nvia: Nifty Gateway');
        expect(markdown).to.have.property('text', 'John Sommet bought a Mystery Box X token on November 1, 2020 (7:42pm UTC)\nMystery Box X is currently trading at $89.33\n[View Old Frog\'s other creations](https://moon.jpeg.com/u/neue-goods)\n\nvia: [Nifty Gateway](https://niftygateway.com)');
    });
});

