const messages = require('../../../components/messages');
const chai = require('chai');
const expect = chai.expect;

const formats = ['plain', 'markdown', 'markdownV2'];

describe('Test Images', function() {
    let payload = {
        bidPayload: {
            date: '2020-11-01T19:42:45.000Z',
            name: 'Mystery Box X',
            url: 'https://one.two.three',
            platform: 'nifty',
            event: 'bid',
        },
        salePayload: {
            date: '2020-11-01T19:42:45.000Z',
            name: 'Mystery Box X',
            platform: 'nifty',
            event: 'sale',
            url: 'https://one.two.three',
            creator: {
                name: 'Old Frog',
                url: 'https://moon.jpeg.com/u/neue-goods'
            }
        },
        dropPayload: {
            name: 'AESII - Technical Cargo Pants',
            url: 'https://one.two.three',
            event: 'drop',
            img: null,
            price: '$56.91',
            creator: {
                name: 'Robots X',
                url: 'https://zora.com/u/robots-x'
            },
            platform: 'nifty',
            date: '2020-07-31T16:00:00.000Z'
        },
        offer: {
            url: 'https://one.two.three',
            date: '2020-11-01T19:42:45.000Z',
            name: 'Mystery Box X',
            platform: 'nifty',
            event: 'offer',
        }
    };
    it('When image is present', function() {
        let alertMessages = Object.keys(payload).map(key => {
            let p = payload[key];
            let pc = {
                ...p,
                img: 'https://res.cloudinary.com/image/upload/123.jpg',
            }

            return formats.map(format => { 
                return messages.alertMessage(pc, format);
            });
        }).flat();

        expect(alertMessages).to.all.have.property('img', 'https://res.cloudinary.com/image/upload/w_300/123.jpg');
    });

    it('Plain message should have link', function() {
        let alertMessages = Object.keys(payload).map(key => {
            let p = payload[key];
            let pc = {
                ...p,
            }

            return messages.alertMessage(pc, 'plain');
        }).flat();

        expect(alertMessages).to.all.satisfy(item => {
            expect(item.text).to.not.match(/https\:\/\/one\.two\.three/);
            return true;
        });

        expect(alertMessages).to.all.have.property('link', 'https://one.two.three');
    });
});
