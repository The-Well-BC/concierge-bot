const messages = require('../../../components/messages');
const chai = require('chai');
const expect = chai.expect;
const formats = ['messages', 'markdown', 'markdownV2'];

describe.skip('Test listing texts', function() {
    let markdownEnder = 'via: [SuperRare](https://superrare.co)\n#NFT';
    let plainEnder = '#SuperRare #NFT';

    it('Closed bid, closedOn date is not supplied', function() {
        let data = {
            name: 'Unit-002',
            url: 'http://boon.com',
            event: 'listing',
            creator: {
                name: 'Neue Goods',
                url: 'https://seller.js'
            },
            seller: {
                name: 'HeyGoomba',
                url: 'https://goomba.com/'
            },
            transaction: {
                price: '$73.58',
            },
            date: '2020-08-31T19:00:00.000Z',
            platform: 'superrare',
            brand: 'postdigital',
            img: 'https://images.ctfassets.net/9tp4nbs38ooy/4UmMq3wdsrhbRq8sK7YNbR/f0d1d4cf77dfe6ffdb1f1e63ef990360/Neuegoods_Box_006.jpg'
        }

        let alertMessage =  messages.alertMessage(data);
        expect(alertMessage).to.have.property('text', 'Unit-002 was put up for sale at a price of *$73.58*.\nDate: August 31, 2020 (7:00pm UTC)\nView Neue Goods\' other NFTs - https://seller.js\n\n' + plainEnder);
    });

    it('Seller url is not available', function() {
        let data = {
            name: 'Unit-002',
            url: 'http://boon.com',
            event: 'listing',
            creator: {
                name: 'Neue Goods',
            },
            seller: {
                name: 'HeyGoomba'
            },
            transaction: {
                price: '$73.58',
            },
            date: '2020-08-31T19:00:00.000Z',
            platform: 'superrare',
            brand: 'postdigital',
            img: 'https://images.ctfassets.net/9tp4nbs38ooy/4UmMq3wdsrhbRq8sK7YNbR/f0d1d4cf77dfe6ffdb1f1e63ef990360/Neuegoods_Box_006.jpg'
        }

        let alertMessage =  messages.alertMessage(data);
        expect(alertMessage).to.have.property('text', 'Unit-002 was put up for sale at a price of *$73.58*.\nDate: August 31, 2020 (7:00pm UTC)\n\n' + plainEnder);
    });
});

