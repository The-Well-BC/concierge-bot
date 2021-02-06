const keys = [ 'event', 'platform', 'date', 'img' ];
const events = ['sale', 'drop', 'bid', 'listing', 'offer']

const dropAssert = require('./assert.drop');
const bidAssert = require('./assert.bid');
const listingAssert = require('./assert.listing');
const transactionAssert = require('./assert.tx');

module.exports = function(chai, utils) {
    let Assertion = chai.Assertion;
    let expect = chai.expect;

    Assertion.addMethod('nftEvent', function(startTime) {
        let obj = this._obj
        if( !Array.isArray(obj) )
            obj = [ obj ];

        if(!startTime)
            throw new Error('No start time');

        let assert = this.assert;

        expect(obj).to.all.include.keys(...keys);

        return obj.forEach(item => {
            assert( (new Date(item.date) >= startTime),
                'Item date (#{act}) to be greater than start time (#{exp})',
                'Item date to not be greater than start time',
                new Date(startTime),
                new Date(item.date)
            );

            if(item.creator) {
                assert( 
                    typeof item.creator === 'object' && item.creator != null,
                    'Property "creator" should be an #{exp}, not #{act}',
                    '',
                    'Object',
                    item
                );

                assert(
                    item.creator.name && typeof item.creator.name === 'string',
                    'Property "creator" should have property "name" of type #{exp}. Got #{act} instead',
                    '',
                    'String',
                    item.creator.name
                );
            }

            assert( 
                !item.img.includes('undefined'),
                'Property "img" should not include string \'undefined\'. Got \'#{act}\'',
                'String',
                item.img
            );

            // Price
            if(item.price) {
                if(/^\$\d/.test(item.price)) {
                    console.log('ITEM PRICE', item.price);
                    
                    assert(/\$\s?0/.test(item.price),
                        'Price should not be $0',
                        '',
                        'Price greater than 0',
                        item.price
                    );
                }
            }

            if(item.transaction && item.transaction.price) {
            }

            assert(events.includes(item.event),
                'Expected item to have property \'event\' that is #{exp}. Got #{act}',
                '',
                '[drop, sale, bid, offer, listing]',
                item.event
            );

            switch(item.event) {
                case 'sale':
                    transactionAssert(item, assert, chai);
                    break;
                case 'drop':
                    dropAssert(item, assert, chai);
                    break;
                case 'bid':
                case 'offer':
                    bidAssert(item, assert, chai);
                    break;
                case 'listing':
                    listingAssert(item, assert, chai);
                    break;
                default:
                    chai.assert.fail(item.event, events,
                        'Event should be one of ' + events + '. Item is ' + item.event
                    );
                    break;
            }
        });
    });
}
