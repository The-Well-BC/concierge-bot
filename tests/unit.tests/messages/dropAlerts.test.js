const messages = require('../../../components/messages');
const chai = require('chai');
chai.use( require('chai-things') );
const expect = chai.expect;
const clone = require('rfdc')();

describe.skip('Test drops text', function() {
    let resourcePayload = [
        {
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
    ]

    it('Check drops', function() {
        let alertMessage =  messages.alertMessage(resourcePayload[0]);
        console.log('MESAGE', alertMessage.text);
        expect(alertMessage).to.have.property('text', 'Robots X(https://zora.com/u/robots-x) released AESII - Technical Cargo Pants(https://zora.com/drops/aes-1337) on July 31, 2020 (4:00pm UTC).\nStarting price is $56.91\n\nvia: Nifty Gateway');

    });
});
