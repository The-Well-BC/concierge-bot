const messages = require('../../../components/messages');
const chai = require('chai');
chai.use( require('chai-things') );
const expect = chai.expect;
const clone = require('rfdc')();

const formats = ['plain', 'markdown', 'markdownV2'];

describe('Test NFT event: DROP/NFT RELEASE', function() {
    let resourcePayload = {
        name: 'AESII - Technical Cargo Pants',
        url: 'https://zora.com/drops/aes-1337',
        event: 'drop',
        img: null,
        price: '$56.91',
        creator: {
            name: 'Robots X',
            url: 'https://zora.com/u/robots-x'
        },
        wallet: {
            address: '0xabcdefgh12345678abcde567',
        },
        platform: 'nifty',
        date: '2020-07-31T16:00:00.000Z'
    }

    let markdownEnder = 'via: [Nifty Gateway](https://niftygateway.com)';
    let markdownV2Ender = '_via: [Nifty Gateway](https://niftygateway.com)_';
    let plainEnder = '#NiftyGateway';

    it('Check drops', function() {
        let alertMessages = formats.map(format => { 
            return messages.alertMessage(resourcePayload, format);
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect(markdown).to.have.property('text', '💫 NEW DROP\n[Robots X](https://zora.com/u/robots-x) just released [AESII - Technical Cargo Pants](https://zora.com/drops/aes-1337)\n\n' + markdownEnder);
        expect(markdownV2).to.have.property('text', '💫 NEW DROP\n[Robots X](https://zora\\.com/u/robots-x) just released [AESII - Technical Cargo Pants](https://zora\\.com/drops/aes-1337)\n\n' + markdownV2Ender);
        expect(plain).to.have.property('link', resourcePayload.url);
        expect(plain).to.have.property('text', '💫 NEW DROP\nRobots X just released "AESII - Technical Cargo Pants" ' + plainEnder);

    });

    it('No creator name', function() {
        let payload = {
            ...resourcePayload,
            creator: {
                wallet: {
                    address: '0xabcdefgh12345678abcde567',
                }
            },
        }
        let alertMessages = formats.map(format => { 
            return messages.alertMessage(payload, format);
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect(markdown).to.have.property('text', '💫 NEW DROP\n0xabc...567 just released [AESII - Technical Cargo Pants](https://zora.com/drops/aes-1337)\n\n' + markdownEnder);
        expect(markdownV2).to.have.property('text', '💫 NEW DROP\n0xabc\\.\\.\\.567 just released [AESII - Technical Cargo Pants](https://zora\\.com/drops/aes-1337)\n\n' + markdownV2Ender);
        expect(plain).to.have.property('link', resourcePayload.url);
        expect(plain).to.have.property('text', '💫 NEW DROP\n0xabc...567 just released "AESII - Technical Cargo Pants" ' + plainEnder);

    });
});
