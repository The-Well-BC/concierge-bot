// const keys = [ 'url', 'date', 'name', 'type', 'price', 'buyer', 'seller', 'platform', 'creator', 'img', 'tokensLeft', 'transaction' ];
const keys = [ 'url', 'date', 'name', 'platform', 'event', 'seller', 'img' ];

module.exports = function(chai, utils) {
    let Assertion = chai.Assertion;
    let expect = chai.expect;

    Assertion.addMethod('nftTransaction', function(startTime) {
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

            if(item.buyer && item.buyer.name) {
                assert( item.buyer.name && typeof item.buyer.name === 'string',
                    `Property "buyer" should have property "name" of type #{exp}. Got ${ item.buyer.name} instead\n #{act}`,
                    '',
                    'String',
                    item.buyer
                );
            }

            let price;
            if(item.price) {
                assert(typeof item.price === 'string', 
                    'item.price should be a #{exp}. Got a #{act} instead',
                    '',
                    'string',
                    item.price
                );
                price = item.price;
            }

            if(item.transaction && item.transaction.price) {
                assert(typeof item.transaction.price === 'string', 
                    'item.transaction.price should be a #{exp}. Got a #{act} instead',
                    '',
                    'string',
                    item.transaction.price
                );

                price = item.transaction.price;
            }

            if(price) {
                let assertChai = chai.assert;
                assertChai.match(price, /(^\$\d+)|(\d\sETH)|(\dETH)/i);
            }

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
                !item.url.includes('undefined'),
                'Property "url" should not include string \'undefined\'. Got \'#{act}\'',
                '',
                'String',
                item.url
            );

            if(item.img) {
                assert( 
                    !item.img.includes('undefined'),
                    'Property "img" should not include string \'undefined\'. Got \'#{act}\'',
                    'String',
                    item.img
                );
            }

            /*
            assert(
                typeof item.transaction === 'object',
                'Property "transaction" should be #{exp} not #{act}',
                '',
                'an object',
                item.transaction
            )
            */

            assert(item.event === 'sale',
                'Expected item to have property \'event\' that is #{exp}. Got #{act}',
                '',
                'sale',
                item.event
            );
        });
    });
}
