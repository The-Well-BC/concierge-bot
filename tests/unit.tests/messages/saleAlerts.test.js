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

    let markdownEnder = '\n\nvia: [Nifty Gateway](https://niftygateway.com)';
    let markdownV2Ender = '\n\n_via: [Nifty Gateway](https://niftygateway.com)_';
    let plainEnder = '#NiftyGateway';

    it('Test messages when all fields are present', function() {
        let payload = {
            ...minPayload,
            url: 'https://one.two.three',
            price: '$42.93',
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

        expect(plain).to.have.property('link', payload.url);
        expect(plain).to.have.property('text', '⚡ NEW SALE\n"Mystery Box X" by Old Frog sold to John Sommet for $80.53 ' + plainEnder);
        expect(markdown).to.have.property('text', '⚡ NEW SALE\n[Mystery Box X](https://one.two.three) by [Old Frog](https://moon.jpeg.com/u/neue-goods) sold to [John Sommet](https://moon.jpeg.com/u/john-sommet) for $80.53' + markdownEnder);
        expect(markdownV2).to.have.property('text', '⚡ NEW SALE\n*[Mystery Box X](https://one\\.two\\.three) * by [Old Frog](https://moon\\.jpeg\\.com/u/neue-goods) sold to [John Sommet](https://moon\\.jpeg\\.com/u/john-sommet) for $80\\.53' + markdownV2Ender);
    });

    it('Test price thousands separator', function() {
        let payload = {
            ...minPayload,
            url: 'https://one.two.three',
            transaction: { }
        }

        let txPrices = ['2261609.4 eth', '$452321.88', '$452,321.88'];

        let alertMessages = formats.map(format => { 
            return txPrices.map(price => {
                let p = { ...payload, transaction: { price }};

                return messages.alertMessage(p, format);
            });
        }).flat();

        expect(alertMessages).to.all.satisfy(e => {
            console.log('ASLERT MESGAJDGEAG', e);
            expect(e.text).to.match(/\$452,321(\\)?\.?88/)
            return true;
        });
    });

    it('Test messages when all fields are present', function() {
        let payload = {
            ...minPayload,
            url: 'https://one.two.three',
            buyer: {
                name: 'John Sommet',
                url: 'https://moon.jpeg.com/u/john-sommet'
            },
            transaction: {
                price: '42.93',
            }
        }

        let coins = ['ETH', 'WETH', 'UNI', 'SOCKS', 'DAI', 'AUDIO'];

        let alertMessages = formats.map(format => { 
            return coins.map(coin => {
                let p = {...payload};
                p.transaction.price = '42.93 ' + coin;
                return messages.alertMessage(p, format);
            });
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect([plain, markdown].flat()).to.all.satisfy(i => {
            expect(i.text).to.match(/for 42.93 (WETH|ETH|DAI|SOCKS|UNI|FWB|AUDIO) \(\$\d+(\.\d{0,2})?\)/);
            return true;
        });

        expect(markdownV2).to.all.satisfy(i => {
            expect(i.text).to.match(/for 42\\.93 (WETH|ETH|DAI|SOCKS|UNI|FWB|AUDIO) \(\$8\\.59\)/);
            return true;
        });
    });

    it('When NFT url is present', function() {
        let payload = {
            ...minPayload,
            url: 'https://one.two.three',
            creator: { name: 'Old Frog' },
            transaction: {
                price: '$80.53',
            }
        }

        let alertMessages = formats.map(format => { 
            return messages.alertMessage(payload, format);
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect(plain.text).to.match(/^.*\r?\n\"Mystery Box X\" by Old Frog/);
        expect(markdown.text).to.match(/^.*\r?\n\[Mystery Box X\]\(https:\/\/one.two.three\) by Old Frog/);
        expect(markdownV2.text).to.match(/^.*\r?\n\*\[Mystery Box X\]\(https:\/\/one\\.two\\.three\)\* by Old Frog/);
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

        expect(plain.text).to.match(/^.*\r?\n\"Mystery Box X\"/);
        expect(markdown.text).to.match(/^.*\r?\nMystery Box X /);
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

    it('When transaction price is not present', function() {
        // Sale price can be in fiat, or eth or any other crypto token. Sale price is not the same as token in transaction

        let payload = {
            ...minPayload,
            price: '$89.33',
            buyer: {
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

        expect([plain, markdown]).to.all.satisfy(message => {
            expect(message.text).to.match(/^.*\r?\n\"?Mystery Box X\"? by Old Frog sold to John Sommet/);
            return true;
        });

        expect(markdownV2.text).to.match(/^.*\r?\n\*Mystery Box X\* by Old Frog sold to John Sommet/);
    });
});

