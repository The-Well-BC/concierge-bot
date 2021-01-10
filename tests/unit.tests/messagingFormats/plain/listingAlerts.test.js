const plain = require('../../../../components/messageFormats/plain');
const chai = require('chai');
const expect = chai.expect;

describe('Test listing texts', function() {
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
            price: '$73.58',
            date: '2020-08-31T19:00:00.000Z',
            platform: 'foundation',
            brand: 'postdigital',
            img: 'https://images.ctfassets.net/9tp4nbs38ooy/4UmMq3wdsrhbRq8sK7YNbR/f0d1d4cf77dfe6ffdb1f1e63ef990360/Neuegoods_Box_006.jpg'
        }

        let alertMessage =  plain.alertMessage(data);
        expect(alertMessage).to.have.property('text', 'Unit-002 was put up for sale at a price of *$73.58*.\nDate: August 31, 2020 (7:00pm UTC)\nView Neue Goods\' other NFTs - https://seller.js\n\nvia: Foundation');
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
            price: '$73.58',
            date: '2020-08-31T19:00:00.000Z',
            platform: 'foundation',
            brand: 'postdigital',
            img: 'https://images.ctfassets.net/9tp4nbs38ooy/4UmMq3wdsrhbRq8sK7YNbR/f0d1d4cf77dfe6ffdb1f1e63ef990360/Neuegoods_Box_006.jpg'
        }

        let alertMessage =  plain.alertMessage(data);
        expect(alertMessage).to.have.property('text', 'Unit-002 was put up for sale at a price of *$73.58*.\nDate: August 31, 2020 (7:00pm UTC)\n\nvia: Foundation');
    });
});

