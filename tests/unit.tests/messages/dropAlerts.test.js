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
        platform: 'nifty',
        date: '2020-07-31T16:00:00.000Z'
    }

    it('Check drops', function() {
        let alertMessages = formats.map(format => { 
            return messages.alertMessage(resourcePayload, format);
        });

        const [plain, markdown, markdownV2] = alertMessages;

        expect(markdown).to.have.property('text', '💫 FRESH MINT / DROP\n[Robots X](https://zora.com/u/robots-x) just released [AESII - Technical Cargo Pants](https://zora.com/drops/aes-1337)\n\nvia: [Nifty Gateway](https://niftygateway.com)');
        expect(markdownV2).to.have.property('text', '💫 FRESH MINT / DROP\n[Robots X](https://zora.com/u/robots-x) just released [AESII - Technical Cargo Pants](https://zora.com/drops/aes-1337)\n\n_via: [Nifty Gateway](https://niftygateway.com)_');
        expect(plain).to.have.property('text', '💫 FRESH MINT / DROP\nRobots X just released AESII - Technical Cargo Pants\n\nMORE → https://zora.com/drops/aes-1337\n\nvia: Nifty Gateway');

    });
});
