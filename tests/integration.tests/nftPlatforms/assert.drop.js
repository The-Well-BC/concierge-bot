const keys = [ 'name', 'url', 'event', 'creator', 'platform', 'date' ];

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

    assert( 
        typeof item.creator === 'object' && item.creator != null,
        'Property "creator" should be an #{exp}, not #{act}',
        '',
        'Object',
        item
    );

    if(!item.creator.wallet) {
        assert(
            item.creator.name && typeof item.creator.name === 'string',
            'Property "creator" should have property "name" of type #{exp}. Got #{act} instead',
            '',
            'String',
            item.creator.name
        );
    } else {
        assert(
            item.creator.wallet && typeof item.creator.wallet.address === 'string',
            'Property "creator" should have property "wallet.address" of type #{exp}. Got #{act} instead',
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

    assert(item.event === 'drop',
        'Expected item to have property \'event\' that is #{exp}. Got #{act}',
        '',
        'drop',
        item.event
    );
}
