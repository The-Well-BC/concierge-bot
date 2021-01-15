// const keys = [ 'url', 'date', 'name', 'type', 'price', 'buyer', 'seller', 'platform', 'creator', 'img', 'tokensLeft', 'transaction' ];
const keys = [ 'url', 'date', 'name', 'platform', 'event', 'img' ];

module.exports = function(item, assert, chai) {
    let expect = chai.expect;

    expect(item).to.include.keys(...keys);

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

    /*
    assert(
        typeof item.transaction === 'object',
        'Property "transaction" should be #{exp} not #{act}',
        '',
        'an object',
        item.transaction
    )
    */

    assert(item.event === 'bid',
        'Expected item to have property \'event\' that is #{exp}. Got #{act}',
        '',
        'bid',
        item.event
    );
}
