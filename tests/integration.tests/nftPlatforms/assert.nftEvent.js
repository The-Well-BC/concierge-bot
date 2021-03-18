const keys = [ 'event', 'platform', 'date', 'url' ];
const events = ['sale', 'drop', 'bid', 'listing', 'offer']

const dropAssert = require('./assert.drop');
const bidAssert = require('./assert.bid');
const listingAssert = require('./assert.listing');
const transactionAssert = require('./assert.tx');

const expect = require('chai').expect;

module.exports = function(chai, utils) {
    let Assertion = chai.Assertion;
    let expect = chai.expect;

    Assertion.addMethod('nftEvent', function(startTime, creators) {
        let obj = this._obj
        if( !Array.isArray(obj) )
            obj = [ obj ];

        if(!startTime)
            throw new Error('No start time');

        let assert = this.assert;

        obj.forEach(o => {
            if(!o.url)
                console.log('OBJEECT HAS NO URL\n', o);
        });

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
            }

            expect(item.creator).to.have.property('wallet');
            assert(
                creators.includes(item.creator.wallet.address.toLowerCase()) === true,
                `Item from platform ${item.platform} should have one of the curated creators. #{act}`,
                 '',
                creators,
                item.creator
            );
            expect(creators).to.include(item.creator.wallet.address.toLowerCase(), 'Every creator should have a wallet address');

            // NFT event images are not compulsory anymore
            if(item.img) {
                assert( 
                    !item.img.includes('undefined'),
                    'Property "img" should not include string \'undefined\'. Got \'#{act}\'',
                    'String',
                    item.img
                );
            }

            assert(
                !item.url.includes('undefined'),
                'Property "url" should not include string \'undefined\'. Got \'#{act}\'',
                '',
                'String',
                item.url
            );

            // Price
            if(item.price) {
                if(/^\$\d/.test(item.price)) {
                    assert(/\$\s?0$/.test(item.price) === false,
                        'Price should not be $0',
                        '',
                        'Price greater than $0.00',
                        item
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
