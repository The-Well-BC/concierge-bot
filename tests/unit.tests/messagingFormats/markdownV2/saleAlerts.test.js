const alerts = require('../../../../components/messageFormats/markdownV2');
const chai = require('chai');
chai.use( require('chai-things') );
const expect = chai.expect;
const clone = require('rfdc')();

describe('Test sale alert texts', function() {
    it('When buyer profile url is available', function() {

        let payload = {
            date: '2020-11-01T19:42:45.000Z',
            name: 'Mystery Box X',
            price: '$80.53',
            currentPrice: '$89.33',
            buyer: {
                name: 'John Sommet',
                url: 'https://moon.jpeg.com/u/john-sommet'
            },
            platform: 'foundation',
            creator: {
                name: 'Old Frog',
                url: 'https://moon.jpeg.com/u/neue-goods'
            },
            status: 'Open',
            action: 'sale',
        }

        let alertMessage =  alerts.alertMessage(payload);
        expect(alertMessage).to.have.property('text', '[John Sommet](https://moon.jpeg.com/u/john-sommet) just bought Mystery Box X for $80.53 on November 1, 2020 (7:42pm UTC)\nMystery Box X is currently trading at $89.33\n[View Old Frog\'s other creations](https://moon.jpeg.com/u/neue-goods)\n\n_via: Foundation_');
    });
});

