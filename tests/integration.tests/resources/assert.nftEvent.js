const keys = [ 'event', 'platform', 'date' ];
const events = ['sale', 'drop', 'bid', 'listing', 'offer']

const dropAssert = require('./assert.drop');
const bidAssert = require('./assert.bid');
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

            if(item.img) {
                assert( 
                    !item.img.includes('undefined'),
                    'Property "img" should not include string \'undefined\'. Got \'#{act}\'',
                    'String',
                    item.img
                );
            }

            assert(events.includes(item.event),
                'Expected item to have property \'event\' that is #{exp}. Got #{act}',
                '',
                '[drop, sale, bid, offer, listing]',
                item.event
            );

            if(item.event === 'sale')
                transactionAssert(item, assert, chai);
            else if(item.event === 'drop')
                dropAssert(item, assert, chai);
            else if(item.event === 'bid')
                bidAssert(item, assert, chai);
            else if(item.event === 'listing')
                bidAssert(item, assert, chai);
            else {
                chai.assert.fail(item.event, events,
                    'Event should be one of ' + events
                );
            }
        });
    });
}
