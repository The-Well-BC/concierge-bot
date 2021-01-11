const chai = require('chai').use(require('chai-things'));
chai.use(require('chai-subset'));

chai.use(require('../../helpers/noUndefinedKeys'));
chai.use(require('./dropAssert.js'));

const expect = chai.expect;

const foundation = require('../../../components/nftTradingPlatforms/foundation');
const zora = require('../../../components/nftTradingPlatforms/zora');
const nifty = require('../../../components/nftTradingPlatforms/nifty');
const superrare = require('../../../components/nftTradingPlatforms/superrare');

describe('Fetch drops', function() {
    this.timeout(10000);

    const now = new Date();
    let startTime = new Date().setDate(now.getDate() - 220);

    it('Fetch drops from foundation', function() {
        this.timeout(20000);
        const limit = 2;

        return foundation.fetchDrops( parseInt(startTime/1000), limit )
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res).to.not.have.lengthOf.above(limit);
            expect(res).to.all.have.property('platform', 'foundation');

            expect(res, 'Nft Drop test').to.all.be.nftDrop(startTime);
            expect(res, 'No undefined properties').to.all.have.noUndefinedKeys();
        });
    });

    it('Fetch drops from Nifty Gateway', function() {
        const limit = 2;
        startTime = new Date().setDate(now.getDate() - 8);

        return nifty.fetchDrops( startTime, limit )
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res).to.not.have.lengthOf.above(limit);
            expect(res).to.all.have.property('platform', 'nifty');

            expect(res, 'No undefined properties').to.all.have.noUndefinedKeys();
            expect(res, 'Nft Drop test').to.all.be.nftDrop(startTime);
        });
    })

    it('Fetch drops from SuperRare', function() {
        const limit = 3;

        startTime = new Date().setDate(now.getDate() - 9);

        return superrare.fetchDrops( startTime, limit )
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res).to.not.have.lengthOf.above(limit);
            expect(res).to.all.have.property('platform', 'superrare');

            expect(res, 'No undefined properties').to.all.have.noUndefinedKeys();
            expect(res, 'Nft Drop test').to.all.be.nftDrop(startTime);
        });
    });

    it.skip('Fetch drops from Zora', function() {
        const limit = 3;

        return zora.fetchDrops(startTime, limit)
        .then(res => {
            expect(res).to.not.be.empty;
            expect(res).to.not.have.lengthOf.above(limit);
            expect(res).to.all.have.property('platform', 'zora');

            expect(res, 'No undefined properties').to.all.have.noUndefinedKeys();
            expect(res, 'Nft Drop test').to.all.be.nftDrop(startTime);
        });
    });
});
